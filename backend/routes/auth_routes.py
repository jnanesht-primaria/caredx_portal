# backend/routes/auth_routes.py (Alternative version)
from flask import Blueprint, request, jsonify
from extensions import get_db_connection, issue_token
from werkzeug.security import check_password_hash
import bcrypt

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    conn = None
    try:
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        password = (data.get("password") or "").strip()
        requested_role = (data.get("role") or "").strip()

        if not email or not password:
            return jsonify({"message": "Email and password are required."}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE LOWER(email) = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "Invalid email or password."}), 401

        # Check inactive status
        if user.get("is_active") == 0:
            return jsonify({"message": "Account is inactive."}), 403

        # Role match check (case-insensitive)
        db_role = (user.get("role") or "").strip()
        if requested_role and db_role.lower() != requested_role.lower():
            return jsonify({
                "message": f"Account exists, but assigned role is '{db_role}' (not '{requested_role}')."
            }), 401

        # Retrieve stored hash
        stored_hash = user.get("password_hash") or ""

        if not stored_hash:
            return jsonify({"message": "Invalid email or password."}), 401

        # Try different password verification methods
        password_matches = False
        
        # First try: Check if it's a bcrypt hash
        if stored_hash.startswith("$2b$") or stored_hash.startswith("$2a$"):
            try:
                password_matches = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
            except Exception:
                password_matches = False
        
        # Second try: Use werkzeug for other hash types
        if not password_matches and stored_hash.startswith(("pbkdf2:", "scrypt:", "argon2:")):
            try:
                password_matches = check_password_hash(stored_hash, password)
            except Exception:
                password_matches = False
        
        # Third try: Plain text (for development/testing)
        if not password_matches:
            password_matches = (stored_hash == password)

        if not password_matches:
            return jsonify({"message": "Invalid email or password."}), 401

        # Issue token
        token = issue_token(user["id"], db_role, user["name"])

        return jsonify({
            "token": token,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "role": db_role,
                "email": user["email"]
            }
        }), 200

    except Exception as e:
        print(f"LOGIN ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"message": f"Server error: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()