// Sequelize-native aggregator
import { Op, fn, col, literal } from 'sequelize';
import EventRaw from '../models/EventRaw.js';
import UserJobRating from '../models/UserJobRating.js';
import sequelize from '../config/database.js';

/**
 * Gộp tất cả event <= cutoff:
 *  rating = 0.25*view + 1.5*save + 2.5*apply
 * Xong thì xoá event đã tính.
 */
export async function aggregateUserJobRatings(cutoff) {
  const t = await sequelize.transaction();
  try {
    // 1) Lấy aggregate (1 query) bằng CASE WHEN (literal)
    const rows = await EventRaw.findAll({
      attributes: [
        ['userId', 'user_id'],
        ['jobId', 'job_id'],
        [fn('SUM', literal(`CASE WHEN eventName='job_view'  THEN 1 ELSE 0 END`)), 'view_count'],
        [fn('SUM', literal(`CASE WHEN eventName='save_job'  THEN 1 ELSE 0 END`)), 'save_count'],
        [fn('SUM', literal(`CASE WHEN eventName='apply_job' THEN 1 ELSE 0 END`)), 'apply_count'],
      ],
      where: {
        eventTs: { [Op.lte]: cutoff },
        userId: { [Op.ne]: null },
        jobId:  { [Op.ne]: null },
        eventName: { [Op.in]: ['job_view', 'save_job', 'apply_job'] }
      },
      group: ['userId', 'jobId'],
      raw: true,
      transaction: t
    });

    if (rows.length === 0) {
      await t.commit();
      return { updatedPairs: 0, deletedEvents: 0 };
    }

    // 2) Upsert cộng dồn (Sequelize.upsert hỗ trợ MSSQL)
    //    Làm theo từng hàng để an toàn, chunk để tránh nghẽn.
    let updatedPairs = 0;
    const CHUNK = 1000;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      // Lấy bản ghi hiện có để cộng lũy kế
      const keys = chunk.map(r => ({ user_id: String(r.user_id), job_id: String(r.job_id) }));
      const existing = await UserJobRating.findAll({
        where: { [Op.or]: keys },
        transaction: t,
        raw: true
      });
      const mapExist = new Map(existing.map(r => [`${r.user_id}|${r.job_id}`, r]));

      for (const r of chunk) {
        const k = `${r.user_id}|${r.job_id}`;
        const cur = mapExist.get(k) || { view_count: 0, save_count: 0, apply_count: 0 };
        const view = Number(cur.view_count || 0) + Number(r.view_count || 0);
        const save = Number(cur.save_count || 0) + Number(r.save_count || 0);
        const apply = Number(cur.apply_count || 0) + Number(r.apply_count || 0);
        const rawRating = view * 0.25 + save * 1.5 + apply * 2.5;
        const rating = Math.min(5, rawRating);

        await UserJobRating.upsert({
          user_id: String(r.user_id),
          job_id:  String(r.job_id),
          view_count: view,
          save_count: save,
          apply_count: apply,
          rating,
          last_aggregated_ts: cutoff
        }, { transaction: t });

        updatedPairs += 1;
      }
    }

    // 3) Xoá các event đã tính (theo điều kiện)
    const deletedEvents = await EventRaw.destroy({
      where: {
        eventTs: { [Op.lte]: cutoff },
        userId: { [Op.ne]: null },
        jobId:  { [Op.ne]: null },
        eventName: { [Op.in]: ['job_view', 'save_job', 'apply_job'] }
      },
      transaction: t
    });

    await t.commit();
    return { updatedPairs, deletedEvents };
  } catch (e) {
    await t.rollback();
    throw e;
  }
}
