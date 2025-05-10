#!/usr/bin/env python
# Script to run all migrations

import time
import importlib.util
import os
import sys

# Wait for the database to be ready
time.sleep(5)

print("Running database migrations...")

# Import and run the migration
try:
    from migrations.create_job_fields import run_migration
    run_migration()
    print("All migrations completed successfully.")
except Exception as e:
    print(f"Migration error: {str(e)}")
    sys.exit(1) 