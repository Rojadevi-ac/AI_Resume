from flask import request, jsonify
from models.user_model import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import datetime

def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"message": "Missing required fields"}), 400

    existing_user = User.find_by_email(data['email'])
    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    user_id = User.create_user(data['name'], data['email'], data['password'])
    
    # Create JWT
    access_token = create_access_token(identity=user_id, expires_delta=datetime.timedelta(days=7))
    
    return jsonify({
        "message": "User registered successfully",
        "access_token": access_token,
        "user": {
            "id": user_id,
            "name": data['name'],
            "email": data['email']
        }
    }), 201

def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Missing required fields"}), 400

    user = User.find_by_email(data['email'])
    if not user or not User.verify_password(user['password'], data['password']):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user['_id']), expires_delta=datetime.timedelta(days=7))
    
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": str(user['_id']),
            "name": user['name'],
            "email": user['email']
        }
    }), 200

@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.get_by_id(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    user['_id'] = str(user['_id'])
    return jsonify({"user": user}), 200
