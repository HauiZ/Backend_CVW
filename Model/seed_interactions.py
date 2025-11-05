import pandas as pd
import numpy as np

# Đọc dữ liệu
print("Đang đọc dữ liệu...")
job_features = pd.read_csv('../data/exports/job_features.csv')
user_features = pd.read_csv('../data/exports/user_features.csv')

print(f"✓ Có {len(user_features)} users")
print(f"✓ Có {len(job_features)} jobs")

def calculate_skill_match(user_skills, job_skills):
    """Tính độ khớp kỹ năng (0-1)"""
    user_skill_set = set([s.strip().lower() for s in str(user_skills).split(',')])
    job_skill_set = set([s.strip().lower() for s in str(job_skills).split(',')])
    
    if len(job_skill_set) == 0:
        return 0.3
    
    match_count = len(user_skill_set.intersection(job_skill_set))
    match_ratio = match_count / len(job_skill_set)
    
    # Bonus nếu có nhiều skills khớp
    if match_count >= 3:
        match_ratio = min(1.0, match_ratio + 0.2)
    
    return match_ratio

def calculate_experience_match(user_exp, job_exp):
    """Tính độ phù hợp kinh nghiệm"""
    diff = user_exp - job_exp
    
    if diff >= 0 and diff <= 2:  # Đủ hoặc vượt 1-2 năm
        return 1.0
    elif diff > 2 and diff <= 5:  # Over-qualified
        return 0.7
    elif diff < 0 and diff >= -1:  # Thiếu 1 năm
        return 0.6
    elif diff < -1 and diff >= -3:  # Thiếu 2-3 năm
        return 0.4
    else:
        return 0.2

def calculate_location_match(user_loc, job_loc):
    """Tính độ khớp địa điểm"""
    user_loc = str(user_loc).strip().lower()
    job_loc = str(job_loc).strip().lower()
    
    if user_loc == job_loc:
        return 1.0
    
    # Các thành phố lớn dễ di chuyển
    big_cities = ['hà nội', 'tp hồ chí minh', 'đà nẵng', 'hải phòng', 'cần thơ']
    
    if any(city in user_loc for city in big_cities) and any(city in job_loc for city in big_cities):
        return 0.6
    elif any(city in user_loc for city in big_cities) or any(city in job_loc for city in big_cities):
        return 0.4
    else:
        return 0.2

def calculate_salary_attractiveness(user_exp, salary):
    """Tính độ hấp dẫn mức lương"""
    # Mức lương kỳ vọng theo kinh nghiệm (VNĐ)
    expected_salary = 15000000 + (user_exp * 4000000)
    
    ratio = salary / expected_salary
    
    if ratio >= 1.5:  # Lương cao hơn 50%
        return 1.0
    elif ratio >= 1.2:  # Cao hơn 20%
        return 0.9
    elif ratio >= 1.0:  # Đúng mức
        return 0.8
    elif ratio >= 0.8:  # Thấp hơn 20%
        return 0.5
    elif ratio >= 0.6:  # Thấp hơn 40%
        return 0.3
    else:
        return 0.1

def extract_level_from_title(title):
    """Trích xuất level từ job title"""
    title_lower = str(title).lower()
    if 'intern' in title_lower:
        return 0
    elif 'junior' in title_lower:
        return 1
    elif 'middle' in title_lower or 'mid' in title_lower:
        return 2
    elif 'senior' in title_lower:
        return 3
    elif 'lead' in title_lower or 'principal' in title_lower:
        return 4
    else:
        return 1  # Default

def calculate_level_match(user_exp, job_title):
    """Tính độ phù hợp level"""
    job_level = extract_level_from_title(job_title)
    
    # Map experience to expected level
    if user_exp <= 1:
        user_level = 0
    elif user_exp <= 3:
        user_level = 1
    elif user_exp <= 5:
        user_level = 2
    elif user_exp <= 8:
        user_level = 3
    else:
        user_level = 4
    
    diff = abs(user_level - job_level)
    
    if diff == 0:
        return 1.0
    elif diff == 1:
        return 0.7
    elif diff == 2:
        return 0.4
    else:
        return 0.2

def generate_realistic_rating(skill_match, exp_match, loc_match, sal_match, level_match):
    """Tạo rating thực tế từ 0.25 đến 5"""
    
    # Trọng số các yếu tố
    weights = {
        'skill': 0.35,
        'exp': 0.25,
        'level': 0.20,
        'loc': 0.10,
        'sal': 0.10
    }
    
    # Tính điểm tổng hợp
    base_score = (
        skill_match * weights['skill'] + 
        exp_match * weights['exp'] + 
        level_match * weights['level'] +
        loc_match * weights['loc'] + 
        sal_match * weights['sal']
    )
    
    # Thêm nhiễu ngẫu nhiên để tự nhiên
    noise = np.random.normal(0, 0.12)
    score = base_score + noise
    
    # Đảm bảo trong khoảng [0, 1]
    score = max(0, min(1, score))
    
    # Chuyển sang thang 0.25-5
    rating = 0.25 + (score * 4.75)
    
    # Làm tròn đến 0.25
    rating = round(rating * 4) / 4
    
    # Đảm bảo trong khoảng [0.25, 5]
    return max(0.25, min(5.0, rating))

# Tạo 500 interactions mới hoàn toàn
print("\n=== BẮT ĐẦU TẠO 500 INTERACTIONS MỚI ===")

new_ratings = []
used_pairs = set()

# Phân bố số ratings cho mỗi user
num_users = len(user_features)
target_ratings = 8000

# Mỗi user sẽ rate bao nhiêu jobs
ratings_per_user = np.random.poisson(target_ratings / num_users, num_users)
ratings_per_user = np.maximum(ratings_per_user, 2)  # Ít nhất 2 ratings/user

# Điều chỉnh để tổng đúng 500
while ratings_per_user.sum() != target_ratings:
    if ratings_per_user.sum() < target_ratings:
        idx = np.random.randint(0, num_users)
        ratings_per_user[idx] += 1
    else:
        idx = np.random.choice(np.where(ratings_per_user > 2)[0])
        ratings_per_user[idx] -= 1

print(f"Phân bố: {ratings_per_user.min()}-{ratings_per_user.max()} ratings/user")

# Tạo ratings cho từng user
for user_idx, num_ratings in enumerate(ratings_per_user):
    user = user_features.iloc[user_idx]
    user_id = user['user_id']
    
    # Chọn jobs để user này đánh giá
    # Ưu tiên jobs phù hợp hơn (theo location và skills)
    
    # Tính điểm phù hợp sơ bộ cho tất cả jobs
    job_scores = []
    for _, job in job_features.iterrows():
        skill_score = calculate_skill_match(user['skills'], job['required_skills'])
        loc_score = calculate_location_match(user['location'], job['location'])
        prelim_score = skill_score * 0.7 + loc_score * 0.3
        job_scores.append((job['job_id'], prelim_score))
    
    # Chọn jobs với xác suất cao hơn cho các jobs phù hợp
    job_scores.sort(key=lambda x: x[1], reverse=True)
    
    # 70% chọn từ top 50%, 30% chọn ngẫu nhiên (để có diversity)
    num_top = int(num_ratings * 0.7)
    num_random = num_ratings - num_top
    
    top_half = len(job_scores) // 2
    selected_jobs = []
    
    # Chọn từ top
    top_candidates = [job_id for job_id, _ in job_scores[:top_half]]
    np.random.shuffle(top_candidates)
    selected_jobs.extend(top_candidates[:num_top])
    
    # Chọn random
    all_job_ids = job_features['job_id'].tolist()
    remaining = [jid for jid in all_job_ids if jid not in selected_jobs]
    np.random.shuffle(remaining)
    selected_jobs.extend(remaining[:num_random])
    
    # Tạo rating cho từng job
    for job_id in selected_jobs:
        if (user_id, job_id) in used_pairs:
            continue
            
        job = job_features[job_features['job_id'] == job_id].iloc[0]
        
        # Tính các yếu tố
        skill_match = calculate_skill_match(user['skills'], job['required_skills'])
        exp_match = calculate_experience_match(user['experience_years'], job['min_experience'])
        loc_match = calculate_location_match(user['location'], job['location'])
        sal_match = calculate_salary_attractiveness(user['experience_years'], job['salary_range'])
        level_match = calculate_level_match(user['experience_years'], job['title'])
        
        # Tạo rating
        rating = generate_realistic_rating(skill_match, exp_match, loc_match, sal_match, level_match)
        
        new_ratings.append({
            'user_id': user_id,
            'job_id': job_id,
            'rating': rating
        })
        
        used_pairs.add((user_id, job_id))

# Tạo DataFrame
ratings_df = pd.DataFrame(new_ratings)

# Sắp xếp
ratings_df = ratings_df.sort_values(['user_id', 'job_id']).reset_index(drop=True)

print(f"\n✅ Đã tạo {len(ratings_df)} interactions mới")

# Thống kê
print("\n=== THỐNG KÊ ===")
print(f"Số lượng: {len(ratings_df)}")
print(f"Số users có rating: {ratings_df['user_id'].nunique()}")
print(f"Số jobs được rate: {ratings_df['job_id'].nunique()}")
print(f"Trung bình ratings/user: {len(ratings_df)/ratings_df['user_id'].nunique():.1f}")
print(f"Trung bình ratings/job: {len(ratings_df)/ratings_df['job_id'].nunique():.1f}")

print(f"\n=== PHÂN BỐ RATINGS ===")
rating_dist = ratings_df['rating'].value_counts().sort_index()
for rating, count in rating_dist.items():
    pct = count / len(ratings_df) * 100
    print(f"{rating}: {count:3d} ({pct:5.1f}%)")

print(f"\nTrung bình: {ratings_df['rating'].mean():.2f}")
print(f"Trung vị: {ratings_df['rating'].median():.2f}")
print(f"Độ lệch chuẩn: {ratings_df['rating'].std():.2f}")

# Lưu file
ratings_df.to_csv('user_ratings_new.csv', index=False)
print("\n✅ Đã lưu: user_ratings_new.csv")

# Hiển thị mẫu
print("\n=== MẪU 20 RATINGS ===")
print(ratings_df.head(20).to_string(index=False))

# Phân tích thêm
print("\n=== PHÂN TÍCH CHẤT LƯỢNG ===")
high_ratings = len(ratings_df[ratings_df['rating'] >= 4.0])
medium_ratings = len(ratings_df[(ratings_df['rating'] >= 2.5) & (ratings_df['rating'] < 4.0)])
low_ratings = len(ratings_df[ratings_df['rating'] < 2.5])

print(f"Ratings cao (≥4.0): {high_ratings} ({high_ratings/len(ratings_df)*100:.1f}%)")
print(f"Ratings trung bình (2.5-4.0): {medium_ratings} ({medium_ratings/len(ratings_df)*100:.1f}%)")
print(f"Ratings thấp (<2.5): {low_ratings} ({low_ratings/len(ratings_df)*100:.1f}%)")