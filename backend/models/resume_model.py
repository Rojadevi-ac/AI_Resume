from bson import ObjectId
from datetime import datetime
from app import create_app
from flask import current_app

class ResumeAnalysis:
    @staticmethod
    def save_analysis(user_id, filename, job_description, score, matched_skills, missing_skills, suggestions):
        db = current_app.db
        
        analysis_data = {
            "user_id": ObjectId(user_id),
            "filename": filename,
            "job_description": job_description,
            "score": score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "suggestions": suggestions,
            "created_at": datetime.utcnow()
        }
        
        result = db.resume_analyses.insert_one(analysis_data)
        return str(result.inserted_id)

    @staticmethod
    def get_history_by_user(user_id):
        db = current_app.db
        # Sort by latest first
        cursor = db.resume_analyses.find({"user_id": ObjectId(user_id)}).sort("created_at", -1)
        
        history = []
        for doc in cursor:
            doc['_id'] = str(doc['_id'])
            doc['user_id'] = str(doc['user_id'])
            history.append(doc)
            
        return history
