import os

class Config:
    # Database Settings
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "root")
    DB_NAME = os.getenv("DB_NAME", "caredx")

    # JWT Settings
    JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-key-change-this")
    JWT_EXPIRES_HOURS = int(os.getenv("JWT_EXPIRES_HOURS", "8"))
    
    ALLOWED_ROLES = {"Admin", "Technician", "Receptionist"}

    @classmethod
    def get_db_config(cls):
        return {
            "host": cls.DB_HOST,
            "user": cls.DB_USER,
            "password": cls.DB_PASSWORD,
            "database": cls.DB_NAME,
        }