from flask import request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.resume_model import ResumeAnalysis
from utils.pdf_extractor import extract_text
from utils.nlp_processor import calculate_ats_score, generate_suggestions
from utils.report_generator import generate_pdf_report
from bson import ObjectId
from flask import current_app
import io

@jwt_required()
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({"message": "No file part"}), 400
        
    file = request.files['resume']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
        
    job_description = request.form.get('job_description', '')
    
    if not job_description:
        return jsonify({"message": "Job description is required"}), 400

    try:
        # 1. Extract text from resume
        resume_text = extract_text(file, file.filename)
        
        if not resume_text:
            return jsonify({"message": "Could not extract text from the provided file."}), 400
            
        # 2. Calculate ATS score and keywords
        score, matched_skills, missing_skills = calculate_ats_score(resume_text, job_description)
        
        # 3. Generate suggestions
        suggestions = generate_suggestions(score, missing_skills)
        
        # 4. Save to Database
        user_id = get_jwt_identity()
        analysis_id = ResumeAnalysis.save_analysis(
            user_id=user_id,
            filename=file.filename,
            job_description=job_description,
            score=score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            suggestions=suggestions
        )
        
        return jsonify({
            "message": "Resume analyzed successfully",
            "analysis_id": analysis_id,
            "data": {
                "score": score,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "suggestions": suggestions,
                "_id": analysis_id,
                "filename": file.filename
            }
        }), 200
        
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    history = ResumeAnalysis.get_history_by_user(user_id)
    return jsonify({"history": history}), 200

@jwt_required()
def download_report(analysis_id):
    user_id = get_jwt_identity()
    db = current_app.db
    
    try:
        # Verify the analysis exists and belongs to the user
        analysis = db.resume_analyses.find_one({
            "_id": ObjectId(analysis_id),
            "user_id": ObjectId(user_id)
        })
        
        if not analysis:
            return jsonify({"message": "Analysis not found"}), 404
            
        pdf_bytes = generate_pdf_report(analysis)
        
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"SmartResume_Report_{analysis.get('filename', 'report')}.pdf"
        )
        
    except Exception as e:
        return jsonify({"message": f"Failed to generate report: {str(e)}"}), 500

@jwt_required()
def chat():
    data = request.get_json()
    message = data.get('message', '').lower()
    
    reply = "I'm a simple AI assistant. For tailored resume advice, make sure to upload your resume and job description to get a detailed ATS score! "
    if 'score' in message:
        reply = "Your ATS score is calculated based on keyword density, formatting, and matching skills between your resume and the job description."
    elif 'format' in message:
        reply = "Make sure to use a standard format, avoid complex tables or columns, and use clear headings like 'Experience' and 'Education'."
    elif 'keywords' in message:
        reply = "Keywords are critical! I extract them using NLP from the job description and look for exact or similar matches in your resume."
        
    import time
    time.sleep(1) # Simulate thinking
    return jsonify({"reply": reply}), 200

