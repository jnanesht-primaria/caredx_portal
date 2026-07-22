# backend/extensions.py
import jwt
import datetime
from flask import current_app
import bcrypt

def issue_token(user_id, role, name):
    """Generate a JWT token for authenticated users"""
    try:
        # Try to import config
        from config import Config
        secret = Config.JWT_SECRET
        expires_hours = Config.JWT_EXPIRES_HOURS
    except ImportError:
        # Fallback to environment variables or defaults
        import os
        secret = os.getenv("JWT_SECRET", "super-secret-key-change-this")
        expires_hours = int(os.getenv("JWT_EXPIRES_HOURS", "8"))

    payload = {
        'user_id': user_id,
        'role': role,
        'name': name,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=expires_hours)
    }
    
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token

def token_required(f):
    """Decorator to protect routes with JWT authentication"""
    from functools import wraps
    from flask import request, jsonify
    
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Try to import config
            from config import Config
            secret = Config.JWT_SECRET
        except ImportError:
            import os
            secret = os.getenv("JWT_SECRET", "super-secret-key-change-this")
        
        try:
            data = jwt.decode(token, secret, algorithms=['HS256'])
            current_user = data
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def get_db_connection():
    """Get database connection using config"""
    from config import Config
    import mysql.connector
    return mysql.connector.connect(**Config.get_db_config())

def hash_password(password):
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')