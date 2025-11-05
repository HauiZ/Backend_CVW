
import cron from 'node-cron';
import { exportAndPurgeRatingsCsv } from '../scripts/exportRatingsCsv.js';

export const cutoffExportAndPurgeRatingsCsv = () => {
    let running = false;
    cron.schedule('*/90 * * * * *', async () => {
        if (running) return; running = true;
        try { await exportAndPurgeRatingsCsv(); }
        catch (e) { console.error('[csv] export purge failed:', e?.message || e); }
        finally { running = false; }
    });
}