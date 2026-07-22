import mysql.connector

from config import Config


def get_db_connection():
    return mysql.connector.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
    )


def find_user_by_email(email: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT id, name, email, password_hash, role, is_active
        FROM users
        WHERE email = %s
        LIMIT 1
        """,
        (email,),
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user


def find_user_by_id(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, name, email, role, is_active FROM users WHERE id = %s LIMIT 1",
        (user_id,),
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user
