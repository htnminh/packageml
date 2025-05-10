# Database migration to add target_column and feature_columns to jobs table
from sqlalchemy import create_engine, text
import os

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://packageml:packageml@mysql/packageml")
engine = create_engine(DATABASE_URL)

def run_migration():
    # SQL queries to add columns
    add_target_column = "ALTER TABLE jobs ADD COLUMN target_column VARCHAR(255) NULL;"
    add_feature_columns = "ALTER TABLE jobs ADD COLUMN feature_columns JSON NULL;"
    
    with engine.connect() as connection:
        # Execute migrations in a transaction
        with connection.begin():
            # Check if columns exist first to avoid errors
            columns = connection.execute(text("SHOW COLUMNS FROM jobs;")).fetchall()
            column_names = [col[0] for col in columns]
            
            # Add target_column if it doesn't exist
            if 'target_column' not in column_names:
                print("Adding target_column to jobs table...")
                connection.execute(text(add_target_column))
                print("target_column added successfully.")
            else:
                print("target_column already exists.")
                
            # Add feature_columns if it doesn't exist
            if 'feature_columns' not in column_names:
                print("Adding feature_columns to jobs table...")
                connection.execute(text(add_feature_columns))
                print("feature_columns added successfully.")
            else:
                print("feature_columns already exists.")
        
    print("Migration completed successfully!")

if __name__ == "__main__":
    run_migration() 