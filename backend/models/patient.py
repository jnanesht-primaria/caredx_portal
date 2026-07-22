from app.models.user import get_db_connection


def create_patient(data: dict, created_by: int) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO patients (full_name, phone, email, dob, gender, address, notes, created_by)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            data["full_name"],
            data["phone"],
            data.get("email"),
            data.get("dob"),
            data.get("gender", "Other"),
            data.get("address"),
            data.get("notes"),
            created_by,
        ),
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return new_id


def search_patients(query: str = "", limit: int = 20):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    like = f"%{query}%"
    cursor.execute(
        """
        SELECT id, full_name, phone, email, dob, gender, address, created_at
        FROM patients
        WHERE full_name LIKE %s OR phone LIKE %s OR email LIKE %s
        ORDER BY created_at DESC
        LIMIT %s
        """,
        (like, like, like, limit),
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


def get_patient(patient_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM patients WHERE id = %s", (patient_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return row
