from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize CORS
    CORS(app)

    # Initialize JWT
    jwt = JWTManager(app)

    # Initialize MongoDB
    client = MongoClient(app.config["MONGO_URI"])
    app.db = client.get_default_database()

    # Register Blueprints
    from routes.auth_routes import auth_bp
    from routes.resume_routes import resume_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(resume_bp, url_prefix='/api/resume')

    @app.route('/')
    def index():
        return {"message": "AI-Based Smart Resume Analyzer API is running!"}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=app.config["PORT"], debug=app.config["DEBUG"])
