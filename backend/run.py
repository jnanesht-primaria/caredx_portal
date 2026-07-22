# backend/run.py
from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.receptionist_routes import receptionist_bp

app = Flask(__name__)

# 🔑 Enable CORS for all routes and allow requests from http://localhost:5173
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Register your blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(receptionist_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)