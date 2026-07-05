import bcrypt
from datetime import datetime
from bson import ObjectId
from app import create_app
from flask import current_app

class User:
    @staticmethod
    def create_user(name, email, password):
        db = current_app.db
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        user_data = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "created_at": datetime.utcnow()
        }
        
        result = db.users.insert_one(user_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_email(email):
        db = current_app.db
        return db.users.find_one({"email": email})

    @staticmethod
    def verify_password(stored_password, provided_password):
        return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password)

    @staticmethod
    def get_by_id(user_id):
        db = current_app.db
        return db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
