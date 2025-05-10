#!/usr/bin/env python
# Script to run all migrations

import time
import importlib.util
import os
import sys
from sqlalchemy import text
from sqlalchemy.exc import OperationalError, ProgrammingError

from app.database import engine

# Wait for the database to be ready
time.sleep(5)

print("Running database migrations...")

# Initialize the database with required data first
print("Initializing database...")
from init_db import init_db
init_db()
print("Database initialization completed.")

# Now run migrations that assume tables exist
try:
    # Check if the jobs table exists before running migrations
    with engine.connect() as connection:
        try:
            result = connection.execute(text("SHOW TABLES LIKE 'jobs'"))
            jobs_exists = bool(result.fetchone())
            
            if jobs_exists:
                print("Running migrations for existing tables...")
                from migrations.create_job_fields import run_migration
                run_migration()
                print("All migrations completed successfully.")
            else:
                print("Jobs table doesn't exist yet. Skipping migrations.")
        except (OperationalError, ProgrammingError) as e:
            print(f"Could not check for tables: {str(e)}")
            print("Skipping migrations for now.")
except Exception as e:
    print(f"Migration error: {str(e)}")
    # Don't exit with error, just continue
    print("Continuing with application startup...") 