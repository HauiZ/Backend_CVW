// controllers/eventsController.js
import * as sink from '../services/eventSink.js';

export const collect = async (req, res) => {
  const b = req.body || {};
  if (!b.event_name) return res.sendStatus(400);

  const event = {
    event_id: b.event_id,
    event_name: b.event_name,
    event_ts: b.event_ts,
    user_id: req.user.id,
    job_id: b.job_id || null,
  };

  sink.enqueue(event);      
  return res.sendStatus(204);
};
