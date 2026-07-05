from flask import Blueprint
from controllers.resume_controller import upload_resume, get_history, download_report, chat

resume_bp = Blueprint('resume', __name__)

resume_bp.route('/upload', methods=['POST'])(upload_resume)
resume_bp.route('/history', methods=['GET'])(get_history)
resume_bp.route('/report/<analysis_id>', methods=['GET'])(download_report)
resume_bp.route('/chat', methods=['POST'])(chat)
