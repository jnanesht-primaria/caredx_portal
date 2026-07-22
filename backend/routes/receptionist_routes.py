# backend/routes/receptionist_routes.py
from flask import Blueprint, jsonify, request
from extensions import token_required
import mysql.connector
from config import Config

receptionist_bp = Blueprint("receptionist", __name__)

@receptionist_bp.route("/api/receptionist/stats", methods=["GET"])
@token_required
def get_stats(current_user):
    """Get dashboard stats for receptionist"""
    try:
        # Get date parameter
        date = request.args.get('date')
        
        # In a real implementation, you would query the database
        # For now, return dummy data
        return jsonify({
            "total_today": 12,
            "checked_in": 4,
            "in_progress": 3,
            "completed": 5,
            "urgent_open": 1,
            "new_patients_today": 2
        }), 200
    except Exception as e:
        print(f"Error in get_stats: {str(e)}")
        return jsonify({"message": "Error fetching stats"}), 500

@receptionist_bp.route("/api/receptionist/appointments", methods=["GET"])
@token_required
def get_appointments(current_user):
    """Get appointments for receptionist"""
    try:
        # Get query parameters
        date = request.args.get('date')
        status = request.args.get('status')
        search = request.args.get('search')
        
        # In a real implementation, you would query the database
        # For now, return empty list
        return jsonify([]), 200
    except Exception as e:
        print(f"Error in get_appointments: {str(e)}")
        return jsonify({"message": "Error fetching appointments"}), 500

@receptionist_bp.route("/api/receptionist/appointments/<int:appointment_id>/status", methods=["PATCH"])
@token_required
def update_appointment_status(current_user, appointment_id):
    """Update appointment status"""
    try:
        data = request.get_json()
        status = data.get('status')
        
        if not status:
            return jsonify({"message": "Status is required"}), 400
        
        # In a real implementation, you would update the database
        return jsonify({"message": "Status updated successfully"}), 200
    except Exception as e:
        print(f"Error in update_appointment_status: {str(e)}")
        return jsonify({"message": "Error updating status"}), 500

@receptionist_bp.route("/api/receptionist/patients", methods=["POST"])
@token_required
def register_patient(current_user):
    """Register a new patient"""
    try:
        data = request.get_json()
        
        # In a real implementation, you would insert into database
        return jsonify({
            "message": "Patient registered successfully",
            "patient_id": 1
        }), 201
    except Exception as e:
        print(f"Error in register_patient: {str(e)}")
        return jsonify({"message": "Error registering patient"}), 500

@receptionist_bp.route("/api/receptionist/appointments", methods=["POST"])
@token_required
def book_appointment(current_user):
    """Book a new appointment"""
    try:
        data = request.get_json()
        
        # In a real implementation, you would insert into database
        return jsonify({
            "message": "Appointment booked successfully",
            "appointment_id": 1
        }), 201
    except Exception as e:
        print(f"Error in book_appointment: {str(e)}")
        return jsonify({"message": "Error booking appointment"}), 500

@receptionist_bp.route("/api/receptionist/patients/search", methods=["GET"])
@token_required
def search_patients(current_user):
    """Search for patients"""
    try:
        query = request.args.get('query', '')
        
        # In a real implementation, you would search the database
        return jsonify([]), 200
    except Exception as e:
        print(f"Error in search_patients: {str(e)}")
        return jsonify({"message": "Error searching patients"}), 500