#!/usr/bin/env python
# Script to initialize database with required data

import sys
import time
from sqlalchemy.exc import OperationalError
from sqlalchemy import inspect

from app.database import engine, SessionLocal, Base
from app.models import User
from app.auth import get_password_hash

def init_db():
    """Initialize the database with default data"""
    print("Checking if database initialization is needed...")
    
    # Wait for database to be ready
    max_retries = 10
    retries = 0
    connected = False
    
    while not connected and retries < max_retries:
        try:
            # Check connection
            with engine.connect() as conn:
                connected = True
                print("Successfully connected to database")
        except OperationalError as e:
            retries += 1
            print(f"Database not ready, retrying in 5 seconds... ({retries}/{max_retries})")
            time.sleep(5)
    
    if not connected:
        print("Failed to connect to database after multiple attempts")
        sys.exit(1)
    
    # Create all tables if they don't exist
    print("Creating database tables if they don't exist...")
    Base.metadata.create_all(bind=engine)
    
    # Check if admin user already exists
    db = SessionLocal()
    try:
        admin_exists = db.query(User).filter(User.email == "admin@packageml.com").first()
        if admin_exists:
            print("Admin user already exists, skipping creation")
            return
        
        print("Creating admin user...")
        # Create admin user
        hashed_password, salt = get_password_hash("admin123")
        admin_user = User(
            email="admin@packageml.com",
            password_hash=hashed_password,
            salt=salt
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created successfully")
        
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 