from flask import Blueprint, jsonify
from extensions import get_db_connection

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/api/admin/dashboard", methods=["GET"])
def admin_dashboard():
    return jsonify({"message": "Welcome to the Admin Dashboard"}), 200