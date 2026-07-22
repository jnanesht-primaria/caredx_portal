# backend/generate_password.py
import bcrypt

def generate_password_hash(password):
    """Generate a bcrypt hash for a password"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

if __name__ == "__main__":
    # Generate hashes for test passwords
    passwords = ["admin123", "reception123", "technician123", "password123"]
    
    for pwd in passwords:
        hashed = generate_password_hash(pwd)
        print(f"Password: '{pwd}'")
        print(f"Hash: '{hashed}'")
        print("-" * 50)