from datetime import date

from app.models.user import get_db_connection


def create_appointment(data: dict, created_by: int) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO appointments
            (patient_id, department, technician_id, appointment_date,
             appointment_time, priority, notes, created_by)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            data["patient_id"],
            data["department"],
            data.get("technician_id"),
            data["appointment_date"],
            data["appointment_time"],
            data.get("priority", "Normal"),
            data.get("notes"),
            created_by,
        ),
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return new_id


def list_appointments(target_date: str = None, status: str = None, search: str = None):
    target_date = target_date or date.today().isoformat()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT a.id, a.department, a.appointment_date, a.appointment_time,
               a.status, a.priority, a.notes, a.checked_in_at,
               p.id AS patient_id, p.full_name AS patient_name, p.phone AS patient_phone,
               u.name AS technician_name
        FROM appointments a
        JOIN patients p ON p.id = a.patient_id
        LEFT JOIN users u ON u.id = a.technician_id
        WHERE a.appointment_date = %s
    """
    params = [target_date]

    if status:
        query += " AND a.status = %s"
        params.append(status)

    if search:
        query += " AND (p.full_name LIKE %s OR p.phone LIKE %s)"
        like = f"%{search}%"
        params.extend([like, like])

    query += " ORDER BY a.appointment_time ASC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


def update_appointment_status(appointment_id: int, status: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    if status == "CheckedIn":
        cursor.execute(
            "UPDATE appointments SET status = %s, checked_in_at = NOW() WHERE id = %s",
            (status, appointment_id),
        )
    else:
        cursor.execute(
            "UPDATE appointments SET status = %s WHERE id = %s",
            (status, appointment_id),
        )

    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    conn.close()
    return affected > 0


def dashboard_stats(target_date: str = None):
    target_date = target_date or date.today().isoformat()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT
            COUNT(*) AS total_today,
            SUM(status = 'Scheduled') AS scheduled,
            SUM(status = 'CheckedIn') AS checked_in,
            SUM(status = 'InProgress') AS in_progress,
            SUM(status = 'Completed') AS completed,
            SUM(status = 'Cancelled') AS cancelled,
            SUM(priority = 'Urgent' AND status NOT IN ('Completed','Cancelled')) AS urgent_open
        FROM appointments
        WHERE appointment_date = %s
        """,
        (target_date,),
    )
    stats = cursor.fetchone()

    cursor.execute(
        "SELECT COUNT(*) AS new_patients_today FROM patients WHERE DATE(created_at) = %s",
        (target_date,),
    )
    stats.update(cursor.fetchone())

    cursor.close()
    conn.close()

    # Normalize None -> 0 (SUM returns NULL when there are no rows)
    return {k: (v or 0) for k, v in stats.items()}
