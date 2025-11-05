"""
ĐÁNH GIÁ MODEL - EVALUATION METRICS
Thêm vào file train.py
"""

import pandas as pd
import pickle
import numpy as np
from models import CollaborativeFiltering, ContentBasedFiltering, HybridRecommender
from rich.console import Console
from rich.table import Table
from rich.progress import track
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
def pretty_table(df, title="DataFrame"):
    console = Console()
    table = Table(title=title)
    for col in df.columns:
        table.add_column(col)
    for _, row in df.iterrows():
        table.add_row(*map(str, row.values))
    console.print(table)


# ============================================================================
# PHẦN 1: EVALUATION METRICS
# ============================================================================

def evaluate_cf_model(cf_model, test_data):
    """
    Đánh giá CF model với test data
    
    Returns:
        dict: RMSE, MAE, và detailed predictions
    """
    console = Console()
    console.print("\n[bold blue]📊 ĐÁNH GIÁ COLLABORATIVE FILTERING MODEL[/bold blue]")
    
    predictions = []
    actuals = []
    errors = []
    
    for _, row in test_data.iterrows():
        user_id = row['user_id']
        job_id = row['job_id']
        actual_rating = row['rating']
        
        # Predict
        try:
            predicted_rating = cf_model.predict(user_id, job_id)
            predictions.append(predicted_rating)
            actuals.append(actual_rating)
            errors.append(abs(predicted_rating - actual_rating))
        except:
            # Skip nếu user/job không có trong training
            continue
    
    if len(predictions) == 0:
        console.print("[red]⚠️ Không có predictions nào được tạo![/red]")
        return None
    
    # Tính metrics
    rmse = np.sqrt(mean_squared_error(actuals, predictions))
    mae = mean_absolute_error(actuals, predictions)
    
    # Tạo bảng kết quả
    results_table = Table(title="CF Model Performance")
    results_table.add_column("Metric", style="cyan")
    results_table.add_column("Value", style="green")
    results_table.add_column("Interpretation", style="yellow")
    
    results_table.add_row("RMSE", f"{rmse:.4f}", "✅ Good" if rmse < 1.0 else "⚠️ Need tuning")
    results_table.add_row("MAE", f"{mae:.4f}", "✅ Good" if mae < 0.8 else "⚠️ Need tuning")
    results_table.add_row("Min Error", f"{min(errors):.4f}", "")
    results_table.add_row("Max Error", f"{max(errors):.4f}", "")
    results_table.add_row("Mean Error", f"{np.mean(errors):.4f}", "")
    results_table.add_row("Test Samples", str(len(predictions)), "")
    
    console.print(results_table)
    
    # Hiển thị sample predictions
    sample_table = Table(title="Sample Predictions (First 10)")
    sample_table.add_column("User ID", style="cyan")
    sample_table.add_column("Job ID", style="cyan")
    sample_table.add_column("Actual", style="green")
    sample_table.add_column("Predicted", style="yellow")
    sample_table.add_column("Error", style="red")
    
    for i in range(min(10, len(predictions))):
        sample_table.add_row(
            str(test_data.iloc[i]['user_id']),
            str(test_data.iloc[i]['job_id']),
            f"{actuals[i]:.2f}",
            f"{predictions[i]:.2f}",
            f"{errors[i]:.2f}"
        )
    
    console.print(sample_table)
    
    return {
        'rmse': rmse,
        'mae': mae,
        'predictions': predictions,
        'actuals': actuals,
        'errors': errors
    }


def evaluate_content_model(cb_model, user_features, job_features, interactions):
    """
    Đánh giá Content-Based model
    Kiểm tra xem similarity có tương quan với ratings không
    """
    console = Console()
    console.print("\n[bold blue]📊 ĐÁNH GIÁ CONTENT-BASED MODEL[/bold blue]")
    
    similarities = []
    ratings = []
    
    for _, row in interactions.iterrows():
        user_id = row['user_id']
        job_id = row['job_id']
        rating = row['rating']
        
        # Get indices
        user_idx = user_features[user_features['user_id'] == user_id].index[0]
        job_idx = job_features[job_features['job_id'] == job_id].index[0]
        
        # Get similarity
        sim = cb_model.get_similarity(user_idx, job_idx)
        
        similarities.append(sim)
        ratings.append(rating)
    
    # Tính correlation
    correlation = np.corrcoef(similarities, ratings)[0, 1]
    
    # Results table
    results_table = Table(title="Content-Based Model Performance")
    results_table.add_column("Metric", style="cyan")
    results_table.add_column("Value", style="green")
    results_table.add_column("Interpretation", style="yellow")
    
    results_table.add_row(
        "Correlation with Ratings",
        f"{correlation:.4f}",
        "✅ Good" if correlation > 0.3 else "⚠️ Weak correlation"
    )
    results_table.add_row("Mean Similarity", f"{np.mean(similarities):.4f}", "")
    results_table.add_row("Min Similarity", f"{min(similarities):.4f}", "")
    results_table.add_row("Max Similarity", f"{max(similarities):.4f}", "")
    
    console.print(results_table)
    
    return {
        'correlation': correlation,
        'similarities': similarities,
        'ratings': ratings
    }


def evaluate_hybrid_model(hybrid_model, test_users, n_recommendations=5):
    """
    Đánh giá Hybrid model
    Kiểm tra quality của recommendations
    """
    console = Console()
    console.print("\n[bold blue]📊 ĐÁNH GIÁ HYBRID MODEL[/bold blue]")
    
    recommendation_scores = []
    diversity_scores = []
    coverage_jobs = set()
    
    for user_id in track(test_users, description="Evaluating users..."):
        try:
            # Get recommendations
            recs = hybrid_model.recommend(user_id, n=n_recommendations)
            
            if len(recs) > 0:
                # Average score
                avg_score = np.mean([r['score'] for r in recs])
                recommendation_scores.append(avg_score)
                
                # Diversity (số lượng job levels khác nhau)
                levels = set([r['level'] for r in recs])
                diversity_scores.append(len(levels))
                
                # Coverage
                for r in recs:
                    coverage_jobs.add(r['job_id'])
        except Exception as e:
            console.print(f"[red]Error for user {user_id}: {e}[/red]")
    
    # Results
    results_table = Table(title="Hybrid Model Performance")
    results_table.add_column("Metric", style="cyan")
    results_table.add_column("Value", style="green")
    results_table.add_column("Interpretation", style="yellow")
    
    if len(recommendation_scores) > 0:
        results_table.add_row(
            "Avg Recommendation Score",
            f"{np.mean(recommendation_scores):.4f}",
            "✅ Good" if np.mean(recommendation_scores) > 0.6 else "⚠️ Low scores"
        )
        results_table.add_row(
            "Avg Diversity",
            f"{np.mean(diversity_scores):.2f}",
            "✅ Diverse" if np.mean(diversity_scores) > 2 else "⚠️ Low diversity"
        )
        results_table.add_row(
            "Job Coverage",
            f"{len(coverage_jobs)} jobs",
            ""
        )
        results_table.add_row(
            "Users Evaluated",
            str(len(recommendation_scores)),
            ""
        )
    else:
        results_table.add_row("Status", "No recommendations generated", "❌ Check model")
    
    console.print(results_table)
    
    return {
        'avg_score': np.mean(recommendation_scores) if recommendation_scores else 0,
        'avg_diversity': np.mean(diversity_scores) if diversity_scores else 0,
        'coverage': len(coverage_jobs)
    }


def precision_at_k(recommendations, relevant_items, k=5):
    """
    Tính Precision@K
    
    Parameters:
        recommendations: List job_ids được gợi ý
        relevant_items: Set job_ids mà user thực sự quan tâm (rating >= 4)
        k: Top K items
    
    Returns:
        float: Precision@K (0-1)
    """
    if len(recommendations) == 0:
        return 0.0
    
    top_k = recommendations[:k]
    relevant_in_top_k = len([job for job in top_k if job in relevant_items])
    
    return relevant_in_top_k / k


def recall_at_k(recommendations, relevant_items, k=5):
    """
    Tính Recall@K
    
    Parameters:
        recommendations: List job_ids được gợi ý
        relevant_items: Set job_ids mà user thực sự quan tâm
        k: Top K items
    
    Returns:
        float: Recall@K (0-1)
    """
    if len(relevant_items) == 0:
        return 0.0
    
    top_k = recommendations[:k]
    relevant_in_top_k = len([job for job in top_k if job in relevant_items])
    
    return relevant_in_top_k / len(relevant_items)


def evaluate_ranking_metrics(hybrid_model, interactions, k=5):
    """
    Đánh giá Precision@K và Recall@K
    """
    console = Console()
    console.print("\n[bold blue]📊 ĐÁNH GIÁ RANKING METRICS (Precision & Recall)[/bold blue]")
    
    precisions = []
    recalls = []
    
    # Get unique users
    users = interactions['user_id'].unique()
    
    for user_id in track(users, description="Calculating metrics..."):
        # Relevant items (jobs user rated >= 4)
        relevant_items = set(
            interactions[
                (interactions['user_id'] == user_id) & 
                (interactions['rating'] >= 4)
            ]['job_id'].values
        )
        
        if len(relevant_items) == 0:
            continue
        
        try:
            # Get recommendations (exclude seen items)
            recs = hybrid_model.recommend(user_id, n=k)
            rec_job_ids = [r['job_id'] for r in recs]
            
            # Calculate metrics
            prec = precision_at_k(rec_job_ids, relevant_items, k)
            rec = recall_at_k(rec_job_ids, relevant_items, k)
            
            precisions.append(prec)
            recalls.append(rec)
        except:
            continue
    
    # Results
    results_table = Table(title=f"Ranking Metrics @{k}")
    results_table.add_column("Metric", style="cyan")
    results_table.add_column("Value", style="green")
    results_table.add_column("Interpretation", style="yellow")
    
    if len(precisions) > 0:
        avg_precision = np.mean(precisions)
        avg_recall = np.mean(recalls)
        f1_score = 2 * (avg_precision * avg_recall) / (avg_precision + avg_recall) if (avg_precision + avg_recall) > 0 else 0
        
        results_table.add_row(
            f"Precision@{k}",
            f"{avg_precision:.4f}",
            "✅ Good" if avg_precision > 0.3 else "⚠️ Low precision"
        )
        results_table.add_row(
            f"Recall@{k}",
            f"{avg_recall:.4f}",
            "✅ Good" if avg_recall > 0.2 else "⚠️ Low recall"
        )
        results_table.add_row(
            "F1-Score",
            f"{f1_score:.4f}",
            "✅ Good" if f1_score > 0.25 else "⚠️ Low F1"
        )
    else:
        results_table.add_row("Status", "No metrics calculated", "❌")
    
    console.print(results_table)
    
    return {
        'precision': avg_precision if precisions else 0,
        'recall': avg_recall if recalls else 0,
        'f1': f1_score if precisions else 0
    }


# ============================================================================
# PHẦN 2: COMPREHENSIVE EVALUATION
# ============================================================================

def comprehensive_evaluation(model_package, test_interactions=None):
    """
    Đánh giá toàn diện model
    
    Parameters:
        model_package: Dict chứa cf_model, cb_model, hybrid_model, data
        test_interactions: DataFrame test data (optional)
    """
    console = Console()
    console.print("\n[bold cyan]" + "="*70 + "[/bold cyan]")
    console.print("[bold cyan]🎯 COMPREHENSIVE MODEL EVALUATION[/bold cyan]")
    console.print("[bold cyan]" + "="*70 + "[/bold cyan]\n")
    
    cf_model = model_package['cf_model']
    cb_model = model_package['cb_model']
    hybrid_model = model_package['hybrid_model']
    user_features = model_package['user_features']
    job_features = model_package['job_features']
    interactions = model_package['interactions']
    
    results = {}
    
    # 1. Evaluate CF Model
    if test_interactions is not None and len(test_interactions) > 0:
        cf_results = evaluate_cf_model(cf_model, test_interactions)
        results['cf'] = cf_results
    else:
        # Nếu không có test data, dùng toàn bộ interactions
        cf_results = evaluate_cf_model(cf_model, interactions)
        results['cf'] = cf_results
    
    # 2. Evaluate Content Model
    content_results = evaluate_content_model(cb_model, user_features, job_features, interactions)
    results['content'] = content_results
    
    # 3. Evaluate Hybrid Model
    test_users = user_features['user_id'].values
    hybrid_results = evaluate_hybrid_model(hybrid_model, test_users, n_recommendations=5)
    results['hybrid'] = hybrid_results
    
    # 4. Evaluate Ranking Metrics
    # ranking_results = evaluate_ranking_metrics(hybrid_model, interactions, k=5)
    # results['ranking'] = ranking_results
    
    # 5. Summary
    console.print("\n[bold green]" + "="*70 + "[/bold green]")
    console.print("[bold green]📋 EVALUATION SUMMARY[/bold green]")
    console.print("[bold green]" + "="*70 + "[/bold green]\n")
    
    summary_table = Table(title="Overall Performance")
    summary_table.add_column("Component", style="cyan")
    summary_table.add_column("Key Metric", style="yellow")
    summary_table.add_column("Value", style="green")
    summary_table.add_column("Status", style="magenta")
    
    # CF
    if results['cf']:
        cf_status = "✅ Good" if results['cf']['rmse'] < 1.0 else "⚠️ Need Tuning"
        summary_table.add_row(
            "Collaborative Filtering",
            "RMSE",
            f"{results['cf']['rmse']:.4f}",
            cf_status
        )
    
    # Content
    content_status = "✅ Good" if results['content']['correlation'] > 0.3 else "⚠️ Weak"
    summary_table.add_row(
        "Content-Based",
        "Correlation",
        f"{results['content']['correlation']:.4f}",
        content_status
    )
    
    # Hybrid
    hybrid_status = "✅ Good" if results['hybrid']['avg_score'] > 0.6 else "⚠️ Low Scores"
    summary_table.add_row(
        "Hybrid Recommender",
        "Avg Score",
        f"{results['hybrid']['avg_score']:.4f}",
        hybrid_status
    )
    
    # Ranking
    # ranking_status = "✅ Good" if results['ranking']['f1'] > 0.25 else "⚠️ Low F1"
    # summary_table.add_row(
    #     "Ranking Quality",
    #     "F1-Score",
    #     f"{results['ranking']['f1']:.4f}",
    #     ranking_status
    # )
    
    console.print(summary_table)
    
    # 6. Recommendations
    console.print("\n[bold yellow]💡 RECOMMENDATIONS:[/bold yellow]")
    
    if results['cf'] and results['cf']['rmse'] > 1.0:
        console.print("   • CF RMSE cao → Tăng n_components hoặc thêm data")
    
    if results['content']['correlation'] < 0.3:
        console.print("   • Content correlation thấp → Điều chỉnh feature weights")
    
    if results['hybrid']['avg_score'] < 0.6:
        console.print("   • Hybrid scores thấp → Tune cf_weight và content_weight")
    
    # if results['ranking']['f1'] < 0.25:
    #     console.print("   • F1 score thấp → Cần cải thiện ranking quality")
    
    console.print("")
    
    return results


# ============================================================================
# PHẦN 3: THÊM VÀO train_and_save_model()
# ============================================================================

def train_and_save_model():
    """Train model và lưu file"""
    
    console = Console()
    console.print("[bold green]🔄 Bắt đầu training...[/bold green]\n")
    
    # Load hoặc tạo data
    interactions = pd.read_csv('../data/exports/interactions.csv')
    user_features = pd.read_csv('../data/exports/user_features.csv')
    job_features = pd.read_csv('../data/exports/job_features.csv')
    # pretty_table(interactions, "User-Job Interactions")
    # pretty_table(user_features, "User Features")
    # pretty_table(job_features, "Job Features")
    train_interactions, test_interactions = train_test_split(
    interactions, test_size=0.2, random_state=42
    )
    # Train CF
    cf_model = CollaborativeFiltering(n_components=5)
    cf_model.fit(train_interactions)
    console.print("✅ CF model trained")
    
    # Train Content-based
    cb_model = ContentBasedFiltering()
    cb_model.fit(user_features, job_features)
    console.print("✅ Content-based model trained")
    
    # Create hybrid
    hybrid_model = HybridRecommender(cf_model, cb_model, user_features, job_features, train_interactions)
    console.print("✅ Hybrid model created\n")
    
    # Package model
    model_package = {
        'cf_model': cf_model,
        'cb_model': cb_model,
        'user_features': user_features,
        'job_features': job_features,
        'interactions': train_interactions,
        'hybrid_model': hybrid_model
    }
    
    # ========== ĐÁNH GIÁ MODEL ==========
    console.print("[bold cyan]🎯 Đánh giá model...[/bold cyan]\n")
    evaluation_results = comprehensive_evaluation(model_package, test_interactions)
    
    # Save
    with open('sklearn_hybrid_job_model.pkl', 'wb') as f:
        pickle.dump(model_package, f)
    
    console.print("\n[bold green]💾 Model saved: sklearn_hybrid_job_model.pkl[/bold green]")
    console.print("[bold green]✅ Training complete![/bold green]\n")
    
    return hybrid_model, evaluation_results


# Chỉ chạy khi gọi trực tiếp file này
if __name__ == "__main__":
    model, eval_results = train_and_save_model()