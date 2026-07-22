from flask import Flask

from app.config import Config
from app.extensions import cors
from app.routes.auth_routes import auth_bp
from app.routes.admin_routes import admin_bp
from app.routes.technician_routes import technician_bp
from app.routes.receptionist_routes import receptionist_bp


def create_app(config_class: type = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    cors.init_app(app, origins=app.config["CORS_ORIGINS"])

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(technician_bp, url_prefix="/api/technician")
    app.register_blueprint(receptionist_bp, url_prefix="/api/receptionist")

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app
