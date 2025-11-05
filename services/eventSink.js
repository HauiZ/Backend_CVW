// services/eventSink.js
import crypto from 'crypto';
import dotenv from 'dotenv';
import EventRaw from '../models/EventRaw.js'; // instance đã gắn sequelize
dotenv.config();

const FLUSH_MS   = +(process.env.EVENT_FLUSH_MS   || 1000);
const FLUSH_SIZE = +(process.env.EVENT_FLUSH_SIZE || 1000);
const IMP_RATE   = +((process.env.IMPRESSION_SAMPLE_RATE || '1'));
const MAX_BUFFER = +(process.env.EVENT_MAX_BUFFER || 20000);

let buf = [];
let writing = false;

async function flushMSSQL(batch){
  if (!EventRaw) throw new Error('EventRaw model not loaded');
  const rows = batch.map(e => ({
    eventId:      e.event_id,
    eventName:    e.event_name,
    eventTs:      new Date(e.event_ts),
    sessionId:    e.session_id,
    userId:       e.user_id || null,
    anonId:       e.anon_id || null,
    jobId:        e.job_id || null,
    position:     e.position ?? null,
    rank:         e.rank ?? null,
    score:        e.score ?? null,
    source:       e.source || null,
    query:        e.query || null,
    filters:      e.filters || null,
    page:         e.page || null,
    referrer:     e.referrer || null,
    modelVersion: e.model_version || null,
    abBucket:     e.ab_bucket || null,
  }));
  await EventRaw.bulkCreate(rows); 
}

async function flush() {
  if (writing || buf.length === 0) return;
  writing = true;
  const batch = buf.splice(0, buf.length);
  try { await flushMSSQL(batch); }
  catch (e) { console.error('[eventSink] DB flush failed:', e?.message || e); }
  finally { writing = false; }
}

setInterval(flush, FLUSH_MS);

function enqueue(e){
  // backpressure + sampling
  if (buf.length > MAX_BUFFER && e.event_name === 'job_impression') return;
  if (e.event_name === 'job_impression' && Math.random() > IMP_RATE) return;

  // chuẩn hoá
  if (!e.event_id) e.event_id = crypto.randomUUID();
  if (!e.event_ts) e.event_ts = new Date().toISOString();

  buf.push(e);
  if (buf.length >= FLUSH_SIZE) flush();
}

export { enqueue };
export async function flushNow(){ await flush(); }
process.on('SIGINT', () => { flush().finally(()=>process.exit(0)); });
process.on('SIGTERM', () => { flush().finally(()=>process.exit(0)); });
