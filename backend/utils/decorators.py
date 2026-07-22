from functools import wraps

import jwt
from flask import g, jsonify, request

from app.utils.security import decode_token


def _extract_token():
    header = request.headers.get("Authorization", "")
    if header.startswith("Bearer "):
        return header.split(" ", 1)[1]
    return None


def token_required(fn):
    """Attaches the decoded token payload to `g.current_user`."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = _extract_token()
        if not token:
            return jsonify({"message": "Missing authorization token."}), 401
        try:
            g.current_user = decode_token(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Session expired. Please sign in again."}), 401
        except jwt.PyJWTError:
            return jsonify({"message": "Invalid token."}), 401
        return fn(*args, **kwargs)

    return wrapper


def roles_required(*allowed_roles):
    """Stack under @token_required. Restricts endpoint to specific roles."""

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_role = g.current_user.get("role")
            if user_role not in allowed_roles:
                return jsonify({"message": "You don't have access to this resource."}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator
