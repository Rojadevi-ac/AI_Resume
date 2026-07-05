import os
from dotenv import load_dotenv

load_dotenv(override=True)

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/smart_resume_analyzer")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-secret-key")
    DEBUG = os.getenv("DEBUG", "True").lower() in ["true", "1", "yes"]
    PORT = int(os.getenv("PORT", 5000))
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
