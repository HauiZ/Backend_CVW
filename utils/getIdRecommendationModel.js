import axios from "axios";
import NodeCache from 'node-cache';
import User from "../models/User.js";
import PersonalUser from "../models/PersonalUser.js";

const recCache = new NodeCache({ stdTTL: 3 }); // cache 5 phút

const REC_BASE = "http://localhost:2000";

async function getRecommendations(user_id) {
  const cacheKey = `rec_${user_id}`;
  const cached = recCache.get(cacheKey);
  if (cached) return cached;

  try {
    const user = await User.findByPk(user_id, { 
      attributes: ['id','createAt'],
      raw: true 
    });
    
    if (!user) return [];

    const isNewUser = (Date.now() - new Date(user.createAt)) <= 86400000; 
    let jobIds = [];

    if (isNewUser) {
      const profile = await PersonalUser.findOne({
        where: { userId: user_id },
        attributes: ['skills','yearsExperience','location'],
        raw: true
      });

      const { data } = await axios.post(`${REC_BASE}/api/recommend/cold-start`, {
        skills: Array.isArray(profile?.skills) ? profile.skills.join(',') : (profile?.skills || ''),
        experience_years: Number(profile?.yearsExperience ?? 0),
        location: profile?.location || '',
        n: 5
      }, { 
        timeout: 2000, // giảm timeout xuống 2s
        headers: { 'Accept-Encoding': 'gzip' }
      });
      
      jobIds = data?.job_ids || [];
    } else {
      const { data } = await axios.post(`${REC_BASE}/api/recommend/hybrid`, 
        { user_id, n: 5 }, 
        { timeout: 2000 }
      );
      jobIds = data?.job_ids || [];
    }

    recCache.set(cacheKey, jobIds);
    return jobIds;
  } catch (err) {
    console.error('Recommendation error:', err.message);
    return []; // Fail gracefully
  }
}

export { getRecommendations };