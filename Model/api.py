"""
FLASK API - JOB RECOMMENDATION
Chỉ 3 APIs cần thiết
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model
print("📂 Loading model...")
with open('sklearn_hybrid_job_model.pkl', 'rb') as f:
    model_package = pickle.load(f)

hybrid_model = model_package['hybrid_model']
cb_model = model_package['cb_model']
user_features = model_package['user_features']
job_features = model_package['job_features']
print("✅ Model loaded!")


# ============================================================================
# API 1: Gợi ý cho USER CÓ INTERACTIONS (Hybrid)
# ============================================================================

@app.route('/api/recommend/hybrid', methods=['POST'])
def recommend_hybrid():
    """
    Gợi ý cho user có trong hệ thống
    
    Request:
    {
        "user_id": 1,
        "n": 5
    }
    
    Response:
    {
        "user_id": 1,
        "job_ids": [104, 103, 101]
    }
    """
    data = request.get_json()
    user_id = data.get('user_id')
    n = data.get('n', 5)
    
    try:
        recommendations = hybrid_model.recommend(user_id=user_id, n=n)
        job_ids = [rec['job_id'] for rec in recommendations]
        
        return jsonify({
            'user_id': user_id,
            'job_ids': job_ids
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# ============================================================================
# API 2: Gợi ý cho USER MỚI - COLD START (Content-Based Model)
# ============================================================================

@app.route('/api/recommend/cold-start', methods=['POST'])
def recommend_cold_start():
    """
    Gợi ý cho user mới sử dụng Content-Based Model đã train
    
    Request:
    {
        "skills": "Python,Java",
        "experience_years": 3,
        "location": "HCMC",
        "education": "Bachelor",
        "n": 5
    }
    
    Response:
    {
        "job_ids": [101, 104, 106]
    }
    """
    data = request.get_json()
    n = data.get('n', 9)
    
    try:
        # Tạo user profile vector tương tự như trong training
        # Chuẩn hóa skills text
        user_skills_text = data['skills'].replace(',', ' ')
        
        # Transform skills bằng TF-IDF vectorizer đã train
        user_skill_vector = cb_model.tfidf_vectorizer.transform([user_skills_text]).toarray()[0]
        
        # Tính similarity với tất cả jobs
        scores = []
        for job_idx, job_row in job_features.iterrows():
            job_id = job_row['job_id']
            
            # 1. Skills similarity using TF-IDF cosine similarity
            job_vec = cb_model.job_skill_vectors[job_idx]
            
            # Cosine similarity
            dot_product = np.dot(user_skill_vector, job_vec)
            user_norm = np.linalg.norm(user_skill_vector)
            job_norm = np.linalg.norm(job_vec)
            
            if user_norm > 0 and job_norm > 0:
                skills_sim = dot_product / (user_norm * job_norm)
            else:
                skills_sim = 0.0
            
            # 2. Experience match (exponential decay)
            user_exp = data['experience_years']
            job_exp = job_row['min_experience']
            exp_diff = abs(user_exp - job_exp)
            
            if user_exp >= job_exp:
                exp_sim = 1.0  # Đạt yêu cầu
            else:
                exp_sim = np.exp(-0.3 * exp_diff)  # Penalty nếu thiếu kinh nghiệm
            
            # 3. Location match
            user_loc = data['location']
            job_loc = job_row['location']
            loc_sim = 1.0 if user_loc == job_loc else 0.4
            
            # 4. Combined similarity với weights giống model
            # Skills quan trọng nhất (50%), exp (35%), location (15%)
            total_sim = (
                skills_sim * 0.5 + 
                exp_sim * 0.1 + 
                loc_sim * 0.4
            )
            
            scores.append({
                'job_id': int(job_id),
                'score': float(np.clip(total_sim, 0, 1))
            })
        
        # Sort và lấy top N
        scores.sort(key=lambda x: x['score'], reverse=True)
        job_ids = [s['job_id'] for s in scores[:n]]
        
        return jsonify({'job_ids': job_ids}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200


if __name__ == '__main__':
    print("\n🚀 Server running on http://localhost:2000")
    app.run(host='0.0.0.0', port=2000, debug=True)