// exportInteractionsCsv.js
import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import UserJobRating from '../models/UserJobRating.js';
import PersonalUser from '../models/PersonalUser.js';
import RecruitmentNews from '../models/RecruitmentNews.js';
import Area from '../models/Area.js';

const OUT_DIR = path.join(process.cwd(), 'data', 'exports');
const OUT_INTERACTIONS = path.join(OUT_DIR, 'interactions.csv');
const OUT_USERS = path.join(OUT_DIR, 'user_features.csv');
const OUT_JOBS = path.join(OUT_DIR, 'job_features.csv');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const esc = v => v == null ? '' : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);

async function writeCsvAtomic(filePath, header, rows) {
  const tmp = filePath + '.tmp';
  const out = fs.createWriteStream(tmp, { flags: 'w', encoding: 'utf8' });
  out.write(header + '\n');
  for (const line of rows) out.write(line + '\n');
  await new Promise((res, rej) => out.end(err => err ? rej(err) : res()));
  try { fs.rmSync(filePath, { force: true }); } catch { }
  fs.renameSync(tmp, filePath);
}

function toCSVUniversal(v) {
  if (Array.isArray(v)) return v.map(s => String(s).trim()).filter(Boolean).join(',');
  if (typeof v === 'string') {
    let s = v.trim().replace(/^["'`]+|["'`]+$/g, '');
    if (!s) return '';
    try { const arr = JSON.parse(s); if (Array.isArray(arr)) return arr.map(x => String(x).trim()).filter(Boolean).join(','); } catch { }
    s = s.replace(/^\s*[•\-*]\s+/gm, '');
    s = s.replace(/(?:\r\n|\r|\n|\\r\\n|\\n|\\r)+/g, ' ').trim();
    if (/[.;]/.test(s)) return s.split(/[.;]+/g).map(x => x.replace(/^[,•\-]+|[,•\-]+$/g, '').trim()).filter(Boolean).join(',');
    if (/, /.test(s)) return s.split(/,\s+/g).map(x => x.trim()).filter(Boolean).join(',');
    return s;
  }
  return '';
}

export async function exportAndPurgeRatingsCsv() {
  const cutoff = new Date(Date.now() - 2000); // an toàn 2s

  // 1) Lấy delta interactions
  const delta = await UserJobRating.findAll({
    attributes: ['user_id', 'job_id', 'rating', 'last_aggregated_ts'],
    where: { last_aggregated_ts: { [Op.lte]: cutoff } },
    raw: true
  });

  // 2) Merge interactions.csv và cộng dồn rating, kẹp tối đa 5
  const map = new Map(); // "user|job" -> rating số

  if (fs.existsSync(OUT_INTERACTIONS)) {
    const lines = fs.readFileSync(OUT_INTERACTIONS, 'utf8').split(/\r?\n/);
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]; if (!line) continue;
      const [u, j, r] = line.split(',');
      if (!u || !j) continue;
      const key = `${u}|${j}`;
      const cur = Number(r);
      map.set(key, Number.isFinite(cur) ? Math.min(5, cur) : 0);
    }
  }

  for (const r of delta) {
    const key = `${String(r.user_id)}|${String(r.job_id)}`;
    const old = map.get(key) || 0;
    const add = Number(r.rating);
    const next = Number.isFinite(add) ? Math.min(5, old + add) : old;
    map.set(key, next);
  }
  const interRows = Array.from(map.keys()).sort().map(k => {
    const [u, j] = k.split('|'); return `${esc(u)},${esc(j)},${map.get(k) ?? 0}`;
  });
  await writeCsvAtomic(OUT_INTERACTIONS, 'user_id,job_id,rating', interRows);

  // 3) Full dump USERS
  const users = await PersonalUser.findAll({
    attributes: ['userId', 'name', 'skills', 'yearsExperience', 'location'],
    raw: true
  });
  const userLines = users.map(u => {
    const skills = toCSVUniversal(u.skills);
    return [
      u.userId == null ? '""' : esc(u.userId),
      u.name == null ? '""' : esc(u.name),
      skills && skills.trim() !== '' ? esc(skills) : '""',
      u.yearsExperience == null ? '""' : esc(u.yearsExperience),
      '""',
      u.location == null ? '""' : esc(u.location)
    ].join(',');
  });
  await writeCsvAtomic(OUT_USERS, 'user_id,name,skills,experience_years,education,location', userLines);

  // 4) Full dump JOBS
  const experienceLevels = {
    'Không yêu cầu': 0,
    'Dưới 1 năm': 0,
    '1-3 năm': 1,
    '2-3 năm': 2,
    '3-5 năm': 3,
    'Trên 5 năm': 5,
    '5-7 năm': 5,
  };
  RecruitmentNews.belongsTo(Area, { foreignKey: 'areaId' });
  const jobs = await RecruitmentNews.findAll({
    attributes: ['id', 'jobTitle', 'jobRequirements', 'experience', 'jobLevel', 'salaryMin', 'salaryMax'],
    include: [{ model: Area, attributes: ['province'] }],
    raw: true
  });
  const jobLines = jobs.map(j => {
    const req = toCSVUniversal(j.jobRequirements);
    const exp = experienceLevels[j.experience];
    const salaryRange = j.salaryMax;
    const loc = j['Area.province'] ?? '';
    return [
      j.id == null ? '""' : esc(j.id),
      j.jobTitle == null ? '""' : esc(j.jobTitle),
      req && req.trim() !== '' ? esc(req) : '""',
      exp == null ? '""' : esc(exp),
      j.jobLevel == null ? '""' : esc(j.jobLevel),
      salaryRange === '' ? '""' : esc(salaryRange),
      (!loc || String(loc).trim() === '') ? '""' : esc(loc)
    ].join(',');
  });
  await writeCsvAtomic(OUT_JOBS, 'job_id,title,required_skills,min_experience,level,salary_range,location', jobLines);

  // 5) Xoá delta trong DB sau khi ghi file thành công
  let deleted = 0;
  if (delta.length > 0) {
    const t = await sequelize.transaction();
    try {
      deleted = await UserJobRating.destroy({
        where: { last_aggregated_ts: { [Op.lte]: cutoff } },
        transaction: t
      });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  return {
    exported: delta.length,
    deleted,
    interactions_file: OUT_INTERACTIONS,
    users_file: OUT_USERS,
    jobs_file: OUT_JOBS,
    total_users: userLines.length,
    total_jobs: jobLines.length,
    cutoff
  };
}

// chạy trực tiếp
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      await sequelize.authenticate();
      const r = await exportAndPurgeRatingsCsv();
      console.log('[exportAndPurgeRatingsCsv]', r);
      process.exit(0);
    } catch (e) {
      console.error('[exportAndPurgeRatingsCsv] failed:', e?.message || e);
      process.exit(1);
    }
  })();
}
