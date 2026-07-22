from flask import Blueprint, jsonify

from app.utils.decorators import roles_required, token_required

technician_bp = Blueprint("technician", __name__)


@technician_bp.get("/dashboard")
@token_required
@roles_required("Technician")
def dashboard():
    # Replace with real queries: assigned tests, pending samples, etc.
    return jsonify({"message": "Welcome to the Technician dashboard."}), 200
