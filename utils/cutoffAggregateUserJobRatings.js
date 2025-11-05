import cron from 'node-cron';
import { aggregateUserJobRatings } from '../services/ratingAggregator.js';

export const cutoffAggregateUserJobRatings = () => {
    const SAFETY_MS = 5000;
    function cutoff60s() {
        const now = Date.now();
        const end = Math.floor(now / 60000) * 60000 - SAFETY_MS; // mốc 00/60 giây − 5s
        return new Date(end);
    }

    let running = false;
    cron.schedule('*/60 * * * * *', async () => {
        if (running) return;
        running = true;
        try {
            const cutoff = cutoff60s();
            await aggregateUserJobRatings(cutoff); // hàm đang xóa tất cả <= cutoff → incremental
        } catch (e) {
            console.error('[cron aggregate] failed:', e.message || e);
        } finally {
            running = false;
        }
    });
}