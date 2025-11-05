import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class CollaborativeFiltering:
    """SVD-based Collaborative Filtering"""
    
    def __init__(self, n_components=10):
        self.n_components = n_components
        self.svd = TruncatedSVD(n_components=n_components, random_state=42)
        self.user_mean = None
        self.R_predicted = None
        self.user_map = None
        self.job_map = None
        
    def fit(self, interactions_df):
        """Train CF model"""
        unique_users = sorted(interactions_df['user_id'].unique())
        unique_jobs = sorted(interactions_df['job_id'].unique())
        
        self.user_map = {uid: idx for idx, uid in enumerate(unique_users)}
        self.job_map = {jid: idx for idx, jid in enumerate(unique_jobs)}
        
        n_users = len(unique_users)
        n_jobs = len(unique_jobs)
        R = np.zeros((n_users, n_jobs))
        
        for _, row in interactions_df.iterrows():
            user_idx = self.user_map[row['user_id']]
            job_idx = self.job_map[row['job_id']]
            R[user_idx, job_idx] = row['rating']
        
        self.user_mean = np.zeros(n_users)
        for i in range(n_users):
            user_ratings = R[i, R[i, :] > 0]
            if len(user_ratings) > 0:
                self.user_mean[i] = user_ratings.mean()
        
        R_normalized = R.copy()
        for i in range(n_users):
            R_normalized[i, R[i, :] > 0] -= self.user_mean[i]
        
        self.svd.fit(R_normalized)
        self.R_predicted = self.svd.inverse_transform(self.svd.transform(R_normalized))
        
        for i in range(n_users):
            self.R_predicted[i, :] += self.user_mean[i]
        
    def predict(self, user_id, job_id):
        """Predict rating"""
        if user_id not in self.user_map or job_id not in self.job_map:
            return 3.0
        
        user_idx = self.user_map[user_id]
        job_idx = self.job_map[job_id]
        
        prediction = self.R_predicted[user_idx, job_idx]
        return np.clip(prediction, 1, 5)


class ContentBasedFiltering:
    """
    Improved Content-based filtering with TF-IDF for skills matching
    """
    
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(
            token_pattern=r'(?u)\b\w+\b',  # Match individual words
            lowercase=True,
            min_df=1
        )
        self.user_skill_vectors = None
        self.job_skill_vectors = None
        self.user_features_df = None
        self.job_features_df = None
        
    def fit(self, user_features_df, job_features_df):
        """Calculate content similarity using TF-IDF"""
        self.user_features_df = user_features_df.copy()
        self.job_features_df = job_features_df.copy()
        
        # Chuẩn hóa skills text
        user_skills_text = user_features_df['skills'].fillna('').str.replace(',', ' ')
        job_skills_text = job_features_df['required_skills'].fillna('').str.replace(',', ' ')
        
        # Fit TF-IDF trên tất cả skills
        all_skills_text = pd.concat([user_skills_text, job_skills_text])
        self.tfidf_vectorizer.fit(all_skills_text)
        
        # Transform
        self.user_skill_vectors = self.tfidf_vectorizer.transform(user_skills_text).toarray()
        self.job_skill_vectors = self.tfidf_vectorizer.transform(job_skills_text).toarray()
        
        print(f"✅ TF-IDF: {self.user_skill_vectors.shape[1]} unique skills detected")
        
    def get_similarity(self, user_idx, job_idx):
        """
        Calculate similarity between user and job
        Combines: TF-IDF skills similarity + experience match + location match
        """
        # 1. Skills similarity using TF-IDF cosine similarity
        user_vec = self.user_skill_vectors[user_idx].reshape(1, -1)
        job_vec = self.job_skill_vectors[job_idx].reshape(1, -1)
        skills_sim = cosine_similarity(user_vec, job_vec)[0][0]
        
        # 2. Experience match (exponential decay)
        user_exp = self.user_features_df.iloc[user_idx]['experience_years']
        job_exp = self.job_features_df.iloc[job_idx]['min_experience']
        exp_diff = abs(user_exp - job_exp)
        # Nếu user có đủ exp -> điểm cao, nếu thiếu -> penalty
        if user_exp >= job_exp:
            exp_sim = 1.0  # Đạt yêu cầu
        else:
            exp_sim = np.exp(-0.3 * exp_diff)  # Penalty nếu thiếu kinh nghiệm
        
        # 3. Location match
        user_loc = self.user_features_df.iloc[user_idx]['location']
        job_loc = self.job_features_df.iloc[job_idx]['location']
        loc_sim = 1.0 if user_loc == job_loc else 0.4  # Penalty nhẹ hơn
        
        # 4. Education level match (optional bonus)
        education_map = {'Bachelor': 1, 'Master': 2, 'PhD': 3}
        user_edu = education_map.get(self.user_features_df.iloc[user_idx]['education'], 1)
        
        # Job level difficulty
        # level_difficulty = {'Junior': 1, 'Mid': 1.5, 'Senior': 2, 
        #                    'Trưởng nhóm': 2.5, 'Quản lý / Giám sát': 3,
        #                    'Thực tập sinh': 0.5, 'Nhân viên': 1}
        # job_difficulty = level_difficulty.get(self.job_features_df.iloc[job_idx]['level'], 1.5)
        
        # Education bonus if qualified
        # edu_bonus = 1.0 if user_edu >= job_difficulty else 0.95
        
        # Combined similarity với weights mới
        # Skills quan trọng nhất (50%), exp (35%), location (15%)
        total_sim = (
            skills_sim * 0.5 + 
            exp_sim * 0.35 + 
            loc_sim * 0.15
        )
        #  * edu_bonus
        
        return np.clip(total_sim, 0, 1)  # Đảm bảo trong [0, 1]


class HybridRecommender:
    """Hybrid Recommendation System"""
    
    def __init__(self, cf_model, cb_model, user_features, job_features, interactions):
        self.cf_model = cf_model
        self.cb_model = cb_model
        self.user_features = user_features
        self.job_features = job_features
        self.interactions = interactions
        
    def recommend(self, user_id, n=5, cf_weight=0.9, content_weight=0.1, filters=None):
        """
        Gợi ý jobs cho user
        Điều chỉnh weights: CF 85%, Content 15%
        """
        if user_id not in self.user_features['user_id'].values:
            raise ValueError(f"User {user_id} không tồn tại!")
        
        seen_jobs = set(self.interactions[self.interactions['user_id'] == user_id]['job_id'])
        predictions = []
        user_idx = self.user_features[self.user_features['user_id'] == user_id].index[0]
        
        for job_idx, job_row in self.job_features.iterrows():
            job_id = job_row['job_id']
            
            if job_id in seen_jobs:
                continue
            
            # Apply filters
            if filters:
                if 'location' in filters and job_row['location'] != filters['location']:
                    continue
                if 'min_salary' in filters and job_row['salary_range'] < filters['min_salary']:
                    continue
            
            # CF score (normalize to 0-1)
            cf_score = self.cf_model.predict(user_id, job_id) / 5.0
            
            # Content score (already 0-1)
            content_score = self.cb_model.get_similarity(user_idx, job_idx)
            
            # Hybrid score
            hybrid_score = (cf_score * cf_weight) + (content_score * content_weight)
            
            predictions.append({
                'job_id': int(job_id),
                'title': job_row['title'],
                'required_skills': job_row['required_skills'],
                'level': job_row['level'],
                'salary_range': int(job_row['salary_range']),
                'location': job_row['location'],
                'score': round(float(hybrid_score), 3),
                'cf_score': round(float(cf_score), 3),
                'content_score': round(float(content_score), 3)
            })
        
        predictions.sort(key=lambda x: x['score'], reverse=True)
        return predictions[:n]
    
    def predict_interest(self, user_id, job_id, cf_weight=0.9, content_weight=0.1):
        """Dự đoán user có quan tâm job không"""
        user_idx = self.user_features[self.user_features['user_id'] == user_id].index[0]
        job_idx = self.job_features[self.job_features['job_id'] == job_id].index[0]

        cf_score = self.cf_model.predict(user_id, job_id) / 5.0
        content_score = self.cb_model.get_similarity(user_idx, job_idx)
        hybrid_score = (cf_score * cf_weight) + (content_score * content_weight)
        
        return {
            'user_id': int(user_id),
            'job_id': int(job_id),
            'hybrid_score': round(float(hybrid_score), 3),
            'cf_score': round(float(cf_score), 3),
            'content_score': round(float(content_score), 3),
            'recommendation': 'High' if hybrid_score > 0.7 else 'Medium' if hybrid_score > 0.5 else 'Low'
        }