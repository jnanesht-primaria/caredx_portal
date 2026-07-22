# backend/run.py
from flask import Flask
from flask_cors import CORS
from routes.receptionist_routes import receptionist_bp
from routes.auth_routes import auth_bp

app = Flask(__name__)
CORS(app)  # Enables requests from frontend

# Register blueprints
app.register_blueprint(receptionist_bp)
app.register_blueprint(auth_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)