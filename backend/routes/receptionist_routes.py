# backend/routes/receptionist_routes.py
from flask import Blueprint, jsonify, request
from extensions import token_required

receptionist_bp = Blueprint("receptionist", __name__)

@receptionist_bp.route("/api/receptionist/stats", methods=["GET"])
@token_required  # 👈 Protects route from unauthorized access
def get_stats():
    # Return dummy stats or database query result
    return jsonify({
        "total_today": 12,
        "checked_in": 4,
        "in_progress": 3,
        "completed": 5,
        "urgent_open": 1,
        "new_patients_today": 2
    }), 200

@receptionist_bp.route("/api/receptionist/appointments", methods=["GET"])
@token_required
def get_appointments():
    return jsonify([]), 200