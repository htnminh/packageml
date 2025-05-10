from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from datetime import timedelta
import json
import random
import string
from typing import List
from sqlalchemy import text

from . import models, schemas, auth
from .database import engine, get_db

# Create tables in the database
models.Base.metadata.create_all(bind=engine)

# Function to check and add missing columns to the jobs table
def migrate_jobs_table():
    try:
        with engine.connect() as connection:
            # Check if columns exist
            result = connection.execute(text("SHOW COLUMNS FROM jobs"))
            columns = [row[0] for row in result.fetchall()]
            
            # Add target_column if missing
            if 'target_column' not in columns:
                print("Adding target_column to jobs table...")
                connection.execute(text("ALTER TABLE jobs ADD COLUMN target_column VARCHAR(255) NULL"))
                print("Added target_column column to jobs table")
            
            # Add feature_columns if missing
            if 'feature_columns' not in columns:
                print("Adding feature_columns to jobs table...")
                connection.execute(text("ALTER TABLE jobs ADD COLUMN feature_columns JSON NULL"))
                print("Added feature_columns column to jobs table")
    except Exception as e:
        print(f"Migration error: {str(e)}")

# Run migrations
try:
    migrate_jobs_table()
    print("Database migrations completed successfully.")
except Exception as e:
    print(f"Error running migrations: {str(e)}")

app = FastAPI(title="PackageML API")

# Add CORS middleware with specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost", "http://frontend"],  # Specific origins for better security
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Add compression middleware for better performance
app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password
    hashed_password, salt = auth.get_password_hash(user.password)
    
    # Create new user
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        salt=salt
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/me/", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/")
def read_root():
    return {"message": "Welcome to PackageML API"}

# Dataset Endpoints
@app.post("/datasets/", response_model=schemas.Dataset)
def create_dataset(
    dataset: schemas.DatasetCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Validate dataset size limits
    if len(dataset.data[0].keys()) > 20:
        raise HTTPException(
            status_code=400, 
            detail="Dataset exceeds column limit. Maximum 20 columns allowed."
        )
    
    if len(dataset.data) > 5000:
        raise HTTPException(
            status_code=400, 
            detail="Dataset exceeds row limit. Maximum 5000 rows allowed."
        )
    
    # Generate schema from the dataset
    schema = []
    for column_name in dataset.data[0].keys():
        column_type = "string"  # Default type
        missing = 0
        example = None
        
        # Determine column type and count missing values
        for row in dataset.data:
            if column_name not in row or row[column_name] is None:
                missing += 1
            else:
                example = str(row[column_name])
                value = row[column_name]
                if isinstance(value, bool):
                    column_type = "boolean"
                elif isinstance(value, int):
                    column_type = "integer"
                elif isinstance(value, float):
                    column_type = "float"
        
        schema.append({
            "name": column_name,
            "type": column_type,
            "missing": missing,
            "example": example
        })
    
    # Calculate size in bytes (approximate)
    size = len(json.dumps(dataset.data))
    
    # Create new dataset
    db_dataset = models.Dataset(
        name=dataset.name,
        filename=dataset.filename,
        description=dataset.description or "",
        data=dataset.data,
        schema=schema,
        rows=len(dataset.data),
        columns=len(schema),
        size=size,
        file_type=dataset.file_type,
        tags=dataset.tags or "",
        missing_values=sum(col["missing"] for col in schema),
        user_id=current_user.id
    )
    
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

@app.post("/datasets/randomize/", response_model=schemas.Dataset)
def create_random_dataset(
    request: schemas.RandomDatasetCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Validate number of rows
    if request.num_rows < 1 or request.num_rows > 2000:
        raise HTTPException(
            status_code=400,
            detail="Number of rows must be between 1 and 2000"
        )
    
    # Define dataset schemas based on type
    dataset_schemas = {
        "Customer Data": {
            "columns": [
                {"name": "customer_id", "type": "string"},
                {"name": "age", "type": "integer"},
                {"name": "gender", "type": "string"},
                {"name": "subscription_length", "type": "integer"},
                {"name": "monthly_charges", "type": "float"},
                {"name": "total_charges", "type": "float"},
                {"name": "churn", "type": "boolean"}
            ],
            "filename": "customer_data.csv",
            "file_type": "CSV"
        },
        "Sales Data": {
            "columns": [
                {"name": "order_id", "type": "string"},
                {"name": "date", "type": "string"},
                {"name": "customer_name", "type": "string"},
                {"name": "product_id", "type": "string"},
                {"name": "quantity", "type": "integer"},
                {"name": "unit_price", "type": "float"},
                {"name": "total", "type": "float"},
                {"name": "discount", "type": "float"}
            ],
            "filename": "sales_data.csv",
            "file_type": "CSV"
        },
        "Product Catalog": {
            "columns": [
                {"name": "product_id", "type": "string"},
                {"name": "name", "type": "string"},
                {"name": "category", "type": "string"},
                {"name": "subcategory", "type": "string"},
                {"name": "price", "type": "float"},
                {"name": "stock_quantity", "type": "integer"},
                {"name": "rating", "type": "float"},
                {"name": "is_available", "type": "boolean"},
                {"name": "description", "type": "string"},
                {"name": "created_date", "type": "string"},
                {"name": "last_updated", "type": "string"},
                {"name": "weight", "type": "float"}
            ],
            "filename": "product_catalog.csv",
            "file_type": "CSV"
        }
    }
    
    # Check if the requested dataset type exists
    if request.dataset_type not in dataset_schemas:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown dataset type. Available types: {', '.join(dataset_schemas.keys())}"
        )
    
    dataset_schema = dataset_schemas[request.dataset_type]
    
    # Generate random data based on schema
    data = []
    for i in range(request.num_rows):
        row = {}
        for column in dataset_schema["columns"]:
            if column["type"] == "string":
                if "id" in column["name"]:
                    row[column["name"]] = f"{column['name'].split('_')[0].upper()}{i+1:04d}"
                elif "name" in column["name"]:
                    row[column["name"]] = random.choice([
                        "Smith", "Johnson", "Williams", "Jones", "Brown", 
                        "Davis", "Miller", "Wilson", "Moore", "Taylor",
                        "Anderson", "Thomas", "Jackson", "White", "Harris"
                    ])
                elif "gender" in column["name"]:
                    row[column["name"]] = random.choice(["Male", "Female", "Other"])
                elif "category" in column["name"]:
                    row[column["name"]] = random.choice([
                        "Electronics", "Clothing", "Books", "Home", "Food", 
                        "Sports", "Beauty", "Toys", "Automotive", "Garden"
                    ])
                elif "subcategory" in column["name"]:
                    row[column["name"]] = random.choice([
                        "Phones", "T-shirts", "Fiction", "Kitchen", "Snacks", 
                        "Outdoor", "Skincare", "Games", "Tools", "Plants"
                    ])
                elif "date" in column["name"]:
                    row[column["name"]] = f"2023-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
                elif "description" in column["name"]:
                    row[column["name"]] = "This is a sample product description."
                else:
                    row[column["name"]] = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            elif column["type"] == "integer":
                if "age" in column["name"]:
                    row[column["name"]] = random.randint(18, 80)
                elif "quantity" in column["name"] or "stock" in column["name"]:
                    row[column["name"]] = random.randint(1, 100)
                elif "subscription" in column["name"]:
                    row[column["name"]] = random.choice([1, 3, 6, 12, 24])
                else:
                    row[column["name"]] = random.randint(1, 1000)
            elif column["type"] == "float":
                if "price" in column["name"] or "charges" in column["name"]:
                    row[column["name"]] = round(random.uniform(10, 200), 2)
                elif "discount" in column["name"]:
                    row[column["name"]] = round(random.uniform(0, 0.3), 2)
                elif "total" in column["name"]:
                    row[column["name"]] = round(random.uniform(50, 1000), 2)
                elif "rating" in column["name"]:
                    row[column["name"]] = round(random.uniform(1, 5), 1)
                elif "weight" in column["name"]:
                    row[column["name"]] = round(random.uniform(0.1, 10), 2)
                else:
                    row[column["name"]] = round(random.uniform(0, 100), 2)
            elif column["type"] == "boolean":
                if "churn" in column["name"]:
                    row[column["name"]] = random.random() > 0.7  # 30% churn rate
                else:
                    row[column["name"]] = random.choice([True, False])
        data.append(row)
    
    # Calculate size in bytes (approximate)
    size = len(json.dumps(data))
    
    # Calculate schema with missing values
    schema = []
    for column in dataset_schema["columns"]:
        schema.append({
            "name": column["name"],
            "type": column["type"],
            "missing": 0,  # No missing values in random data
            "example": str(data[0][column["name"]])
        })
    
    # Create new dataset
    db_dataset = models.Dataset(
        name=f"Random {request.dataset_type}",
        filename=dataset_schema["filename"],
        description=f"Randomly generated {request.dataset_type} with {request.num_rows} rows",
        data=data,
        schema=schema,
        rows=len(data),
        columns=len(schema),
        size=size,
        file_type=dataset_schema["file_type"],
        tags=request.dataset_type.lower().replace(" ", ","),
        missing_values=0,  # No missing values in random data
        user_id=current_user.id
    )
    
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

@app.get("/datasets/", response_model=List[schemas.Dataset])
def get_user_datasets(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    datasets = db.query(models.Dataset).filter(models.Dataset.user_id == current_user.id).all()
    return datasets

@app.get("/datasets/{dataset_id}", response_model=schemas.DatasetDetails)
def get_dataset_details(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    dataset = db.query(models.Dataset).filter(
        models.Dataset.id == dataset_id,
        models.Dataset.user_id == current_user.id
    ).first()
    
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Create a response with sample data (first 10 rows)
    result = schemas.DatasetDetails(
        id=dataset.id,
        name=dataset.name,
        description=dataset.description,
        filename=dataset.filename,
        rows=dataset.rows,
        columns=dataset.columns,
        size=dataset.size,
        file_type=dataset.file_type,
        tags=dataset.tags,
        missing_values=dataset.missing_values,
        used_in_jobs=dataset.used_in_jobs,
        user_id=dataset.user_id,
        created_at=dataset.created_at,
        updated_at=dataset.updated_at,
        column_schema=dataset.schema,
        sample_data=dataset.data[:10]  # Only return first 10 rows
    )
    
    return result

@app.delete("/datasets/{dataset_id}")
def delete_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    dataset = db.query(models.Dataset).filter(
        models.Dataset.id == dataset_id,
        models.Dataset.user_id == current_user.id
    ).first()
    
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    db.delete(dataset)
    db.commit()
    
    return {"message": "Dataset deleted successfully"}

@app.post("/datasets/upload/", response_model=schemas.Dataset)
async def upload_dataset(
    file: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(None),
    first_row_is_header: str = Form("true"),  # Default to true
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Read file content
    content = await file.read()
    
    # Auto-detect file type based on extension
    file_extension = file.filename.split('.')[-1].lower()
    
    # Convert first_row_is_header to boolean
    has_header = first_row_is_header.lower() == "true"
    
    # Parse file based on detected type and convert to dataframe
    try:
        import pandas as pd
        import numpy as np
        import io
        import json
        
        if file_extension == 'csv':
            # Pass header=None if first row is not header
            if has_header:
                df = pd.read_csv(io.StringIO(content.decode('utf-8')))
            else:
                df = pd.read_csv(io.StringIO(content.decode('utf-8')), header=None)
                # Generate column names (Column1, Column2, etc.)
                df.columns = [f'Column{i+1}' for i in range(len(df.columns))]
        elif file_extension in ['json']:
            # Convert JSON to dataframe
            json_data = json.loads(content.decode('utf-8'))
            
            # Handle both array and object formats
            if not isinstance(json_data, list):
                json_data = [json_data]  # Convert single object to list
                
            df = pd.DataFrame(json_data)
        elif file_extension in ['xlsx', 'xls']:
            # Convert Excel to dataframe - pass header=None if first row is not header
            if has_header:
                df = pd.read_excel(io.BytesIO(content))
            else:
                df = pd.read_excel(io.BytesIO(content), header=None)
                # Generate column names
                df.columns = [f'Column{i+1}' for i in range(len(df.columns))]
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload CSV, JSON, or Excel files.")
        
        # Clean up and standardize data types
        for column in df.columns:
            # Check if column contains numeric values
            if pd.api.types.is_numeric_dtype(df[column]):
                # Try to convert to int if all values are whole numbers
                if df[column].dropna().apply(lambda x: x == int(x)).all():
                    df[column] = df[column].fillna(0).astype(int)
                else:
                    df[column] = df[column].fillna(0.0).astype(float)
            else:
                # Convert all non-numeric columns to string
                df[column] = df[column].fillna('').astype(str)
        
        # Convert dataframe to records (list of dictionaries)
        data = df.to_dict(orient="records")
        
        # Generate a new CSV filename
        csv_filename = file.filename.rsplit(".", 1)[0] + ".csv"
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing file: {str(e)}")
    
    # Validate dataset size limits
    if not data:
        raise HTTPException(status_code=400, detail="Dataset is empty")
    
    if len(data[0].keys()) > 20:
        raise HTTPException(
            status_code=400, 
            detail="Dataset exceeds column limit. Maximum 20 columns allowed."
        )
    
    if len(data) > 5000:
        raise HTTPException(
            status_code=400, 
            detail="Dataset exceeds row limit. Maximum 5000 rows allowed."
        )
    
    # Generate schema from the dataset
    schema = []
    for column_name in data[0].keys():
        column_type = "string"  # Default type
        missing = 0
        example = None
        
        # Determine column type and count missing values
        for row in data:
            if column_name not in row or row[column_name] is None or row[column_name] == '':
                missing += 1
            else:
                example = str(row[column_name])
                value = row[column_name]
                if isinstance(value, int):
                    column_type = "integer"
                elif isinstance(value, float):
                    column_type = "float"
                elif isinstance(value, str):
                    column_type = "string"
                # We're limiting to just 3 types as requested
        
        schema.append({
            "name": column_name,
            "type": column_type,
            "missing": missing,
            "example": example
        })
    
    # Calculate size in bytes (approximate)
    size = len(json.dumps(data))
    
    # Create new dataset - always store as CSV type
    db_dataset = models.Dataset(
        name=name,
        filename=csv_filename,  # Use the CSV filename
        description=description or "",
        data=data,
        schema=schema,
        rows=len(data),
        columns=len(schema),
        size=size,
        file_type="CSV",  # Always set to CSV
        tags="",
        missing_values=sum(col["missing"] for col in schema),
        user_id=current_user.id
    )
    
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

# ML Model Endpoints
@app.post("/models/", response_model=schemas.Model)
def create_model(
    model: schemas.ModelCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Verify the dataset exists and belongs to this user
    dataset = db.query(models.Dataset).filter(
        models.Dataset.id == model.dataset_id,
        models.Dataset.user_id == current_user.id
    ).first()
    
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found or not accessible")
    
    # Verify target column exists in dataset (for supervised learning)
    if model.task_type in [schemas.ModelTaskType.CLASSIFICATION, schemas.ModelTaskType.REGRESSION]:
        if not model.target_column:
            raise HTTPException(status_code=400, detail="Target column is required for supervised learning")
        
        # Check if target column exists in dataset schema
        column_names = [col["name"] for col in dataset.schema]
        if model.target_column not in column_names:
            raise HTTPException(status_code=400, detail="Target column does not exist in dataset")
    
    # Create new model
    db_model = models.MLModel(
        name=model.name,
        description=model.description,
        model_type=model.model_type,
        task_type=model.task_type,
        hyperparameters=model.hyperparameters.dict(),
        target_column=model.target_column,
        feature_columns=model.feature_columns,
        dataset_id=model.dataset_id,
        user_id=current_user.id
    )
    
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    return db_model

@app.get("/models/", response_model=List[schemas.ModelWithDataset])
def get_user_models(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get user's models with dataset names
    models_with_datasets = db.query(models.MLModel, models.Dataset.name.label("dataset_name")) \
        .join(models.Dataset, models.MLModel.dataset_id == models.Dataset.id) \
        .filter(models.MLModel.user_id == current_user.id) \
        .all()
    
    # Format the response
    result = []
    for model, dataset_name in models_with_datasets:
        model_dict = {
            "id": model.id,
            "name": model.name,
            "description": model.description,
            "model_type": model.model_type,
            "task_type": model.task_type,
            "dataset_id": model.dataset_id,
            "dataset_name": dataset_name,
            "target_column": model.target_column,
            "feature_columns": model.feature_columns,
            "hyperparameters": model.hyperparameters,
            "is_trained": model.is_trained,
            "training_accuracy": model.training_accuracy,
            "evaluation_metrics": model.evaluation_metrics,
            "user_id": model.user_id,
            "created_at": model.created_at,
            "updated_at": model.updated_at
        }
        result.append(model_dict)
    
    return result

@app.get("/models/{model_id}", response_model=schemas.Model)
def get_model_details(
    model_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get model by ID
    model = db.query(models.MLModel).filter(
        models.MLModel.id == model_id,
        models.MLModel.user_id == current_user.id
    ).first()
    
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    return model

@app.put("/models/{model_id}", response_model=schemas.Model)
def update_model(
    model_id: int,
    model_update: schemas.ModelUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get model by ID
    db_model = db.query(models.MLModel).filter(
        models.MLModel.id == model_id,
        models.MLModel.user_id == current_user.id
    ).first()
    
    if not db_model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Update model fields if provided
    if model_update.name is not None:
        db_model.name = model_update.name
    
    if model_update.description is not None:
        db_model.description = model_update.description
    
    if model_update.hyperparameters is not None:
        db_model.hyperparameters = model_update.hyperparameters.dict()
    
    if model_update.target_column is not None:
        # Verify that the target column exists in the dataset
        dataset = db.query(models.Dataset).filter(models.Dataset.id == db_model.dataset_id).first()
        column_names = [col["name"] for col in dataset.schema]
        
        if model_update.target_column not in column_names:
            raise HTTPException(status_code=400, detail="Target column does not exist in dataset")
        
        db_model.target_column = model_update.target_column
    
    if model_update.feature_columns is not None:
        db_model.feature_columns = model_update.feature_columns
    
    db.commit()
    db.refresh(db_model)
    return db_model

@app.delete("/models/{model_id}")
def delete_model(
    model_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get model by ID
    db_model = db.query(models.MLModel).filter(
        models.MLModel.id == model_id,
        models.MLModel.user_id == current_user.id
    ).first()
    
    if not db_model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Delete the model
    db.delete(db_model)
    db.commit()
    
    return {"message": "Model deleted successfully"}

@app.post("/models/{model_id}/train", response_model=schemas.Model)
def train_model(
    model_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    import pandas as pd
    import numpy as np
    from sklearn.preprocessing import LabelEncoder
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from sklearn.linear_model import LogisticRegression, LinearRegression
    from sklearn.svm import SVC, SVR
    from sklearn.neural_network import MLPClassifier, MLPRegressor
    from sklearn.cluster import KMeans, DBSCAN
    from sklearn.decomposition import PCA
    from sklearn.metrics import accuracy_score, precision_score, f1_score, mean_absolute_error, mean_squared_error, r2_score, silhouette_score
    
    # Get model by ID
    db_model = db.query(models.MLModel).filter(
        models.MLModel.id == model_id,
        models.MLModel.user_id == current_user.id
    ).first()
    
    if not db_model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Get the associated dataset
    dataset = db.query(models.Dataset).filter(models.Dataset.id == db_model.dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Associated dataset not found")
    
    # Convert dataset to DataFrame
    df = pd.DataFrame(dataset.data)
    
    # Preprocessing - Binary encoding for categorical variables
    encoders = {}
    for column in df.columns:
        if df[column].dtype == 'object':
            encoder = LabelEncoder()
            df[column] = encoder.fit_transform(df[column].astype(str))
            encoders[column] = encoder
    
    # Feature selection - use job's feature_columns if provided, otherwise fall back to model's
    feature_columns = db_model.feature_columns or df.columns.tolist()
    target_column = db_model.target_column or df.columns.tolist()[0]
    
    if target_column and target_column in feature_columns:
        feature_columns.remove(target_column)
    
    X = df[feature_columns]
    
    # For supervised learning, prepare target variable
    if db_model.task_type in [schemas.ModelTaskType.CLASSIFICATION, schemas.ModelTaskType.REGRESSION]:
        if not target_column:
            raise HTTPException(status_code=400, detail="Target column required for supervised learning")
        
        y = df[target_column]
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=db_model.hyperparameters.get('random_state', 42)
        )
        
        # Normalize features
        scaler = StandardScaler()
        X_train = scaler.fit_transform(X_train)
        X_test = scaler.transform(X_test)
        
        # Train model based on type
        model_type = db_model.model_type
        hyperparams = db_model.hyperparameters
        
        if db_model.task_type == schemas.ModelTaskType.CLASSIFICATION:
            if model_type == schemas.ModelType.LOGISTIC_REGRESSION:
                sklearn_model = LogisticRegression(
                    C=hyperparams.get('C', 1.0),
                    penalty=hyperparams.get('penalty', 'l2'),
                    solver=hyperparams.get('solver', 'lbfgs'),
                    max_iter=hyperparams.get('max_iter', 100),
                    random_state=hyperparams.get('random_state', 42)
                )
            elif model_type == schemas.ModelType.SVM:
                sklearn_model = SVC(
                    C=hyperparams.get('C', 1.0),
                    kernel=hyperparams.get('kernel', 'rbf'),
                    gamma=hyperparams.get('gamma', 'scale'),
                    random_state=hyperparams.get('random_state', 42)
                )
            elif model_type == schemas.ModelType.NEURAL_NETWORK:
                sklearn_model = MLPClassifier(
                    hidden_layer_sizes=hyperparams.get('hidden_layer_sizes', (100,)),
                    activation=hyperparams.get('activation', 'relu'),
                    learning_rate=hyperparams.get('learning_rate', 'constant'),
                    learning_rate_init=hyperparams.get('learning_rate_init', 0.001),
                    max_iter=hyperparams.get('max_iter', 200),
                    random_state=hyperparams.get('random_state', 42)
                )
            else:
                raise HTTPException(status_code=400, detail="Unsupported model type for classification")
            
            # Train model
            sklearn_model.fit(X_train, y_train)
            
            # Evaluate model
            y_pred = sklearn_model.predict(X_test)
            metrics = {
                'accuracy': float(accuracy_score(y_test, y_pred)),
                'precision': float(precision_score(y_test, y_pred, average='weighted', zero_division=0)),
                'f1': float(f1_score(y_test, y_pred, average='weighted', zero_division=0))
            }
            
        elif db_model.task_type == schemas.ModelTaskType.REGRESSION:
            if model_type == schemas.ModelType.LOGISTIC_REGRESSION:
                sklearn_model = LinearRegression()
            elif model_type == schemas.ModelType.SVR:
                sklearn_model = SVR(
                    C=hyperparams.get('C', 1.0),
                    kernel=hyperparams.get('kernel', 'rbf'),
                    gamma=hyperparams.get('gamma', 'scale')
                )
            elif model_type == schemas.ModelType.NEURAL_NETWORK:
                sklearn_model = MLPRegressor(
                    hidden_layer_sizes=hyperparams.get('hidden_layer_sizes', (100,)),
                    activation=hyperparams.get('activation', 'relu'),
                    learning_rate=hyperparams.get('learning_rate', 'constant'),
                    learning_rate_init=hyperparams.get('learning_rate_init', 0.001),
                    max_iter=hyperparams.get('max_iter', 200),
                    random_state=hyperparams.get('random_state', 42)
                )
            else:
                raise HTTPException(status_code=400, detail="Unsupported model type for regression")
            
            # Train model
            sklearn_model.fit(X_train, y_train)
            
            # Evaluate model
            y_pred = sklearn_model.predict(X_test)
            metrics = {
                'mae': float(mean_absolute_error(y_test, y_pred)),
                'mse': float(mean_squared_error(y_test, y_pred)),
                'r2': float(r2_score(y_test, y_pred))
            }
            
        # Update model information
        db_model.is_trained = True
        db_model.training_accuracy = metrics.get('accuracy') or metrics.get('r2')
        db_model.evaluation_metrics = metrics
            
    else:  # Unsupervised learning
        # Normalize features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # No test-train split for unsupervised learning
        if db_model.task_type == schemas.ModelTaskType.CLUSTERING:
            if model_type == schemas.ModelType.KMEANS:
                sklearn_model = KMeans(
                    n_clusters=hyperparams.get('n_clusters', 8),
                    init=hyperparams.get('init', 'k-means++'),
                    random_state=hyperparams.get('random_state', 42)
                )
                sklearn_model.fit(X_scaled)
                labels = sklearn_model.labels_
                metrics = {
                    'inertia': float(sklearn_model.inertia_),
                    'n_clusters': int(hyperparams.get('n_clusters', 8)),
                    'silhouette_score': float(silhouette_score(X_scaled, labels, sample_size=min(1000, X_scaled.shape[0])))
                }
                
            elif model_type == schemas.ModelType.DBSCAN:
                sklearn_model = DBSCAN(
                    eps=hyperparams.get('eps', 0.5),
                    min_samples=hyperparams.get('min_samples', 5)
                )
                sklearn_model.fit(X_scaled)
                labels = sklearn_model.labels_
                n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
                metrics = {
                    'n_clusters': int(n_clusters),
                    'n_noise': int(list(labels).count(-1))
                }
                
        elif db_model.task_type == schemas.ModelTaskType.DIMENSIONALITY_REDUCTION:
            if model_type == schemas.ModelType.PCA:
                sklearn_model = PCA(
                    n_components=hyperparams.get('n_components', 2)
                )
                X_transformed = sklearn_model.fit_transform(X_scaled)
                metrics = {
                    'explained_variance_ratio': [float(v) for v in sklearn_model.explained_variance_ratio_],
                    'n_components': int(hyperparams.get('n_components', 2))
                }
        
        # Update model information
        db_model.is_trained = True
        db_model.evaluation_metrics = metrics
    
    db.commit()
    db.refresh(db_model)
    return db_model

# Job Endpoints
@app.post("/jobs/", response_model=schemas.Job)
def create_job(
    job: schemas.JobCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Verify the model exists and belongs to this user
    model = db.query(models.MLModel).filter(
        models.MLModel.id == job.model_id,
        models.MLModel.user_id == current_user.id
    ).first()
    
    if not model:
        raise HTTPException(status_code=404, detail="Model not found or not accessible")
    
    # Make sure a dataset_id is provided
    if not job.dataset_id:
        raise HTTPException(status_code=400, detail="Dataset ID is required")
    
    # Verify dataset exists and belongs to this user
    dataset = db.query(models.Dataset).filter(
        models.Dataset.id == job.dataset_id,
        models.Dataset.user_id == current_user.id
    ).first()
    
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found or not accessible")
    
    # Create new job
    db_job = models.Job(
        name=job.name,
        description=job.description,
        model_id=job.model_id,
        dataset_id=job.dataset_id,
        target_column=job.target_column,
        feature_columns=job.feature_columns,
        status=models.JobStatus.PENDING,  # Always set to PENDING by default
        progress=0,
        user_id=current_user.id
    )
    
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    
    # Start the job asynchronously (in a real implementation, this would be handled by a task queue)
    # For simplicity, we'll just kick off the training here directly
    import threading
    threading.Thread(target=run_training_job, args=(db_job.id,)).start()
    
    return db_job

@app.get("/jobs/", response_model=List[schemas.JobWithDetails])
def get_user_jobs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get user's jobs with model and dataset names
    jobs_with_details = db.query(
        models.Job,
        models.MLModel.name.label("model_name"),
        models.MLModel.model_type.label("model_type"),
        models.Dataset.name.label("dataset_name")
    ).join(
        models.MLModel, models.Job.model_id == models.MLModel.id
    ).join(
        models.Dataset, models.Job.dataset_id == models.Dataset.id
    ).filter(
        models.Job.user_id == current_user.id
    ).all()
    
    # Format the response
    result = []
    for job, model_name, model_type, dataset_name in jobs_with_details:
        job_dict = {
            "id": job.id,
            "name": job.name,
            "description": job.description,
            "status": job.status,
            "progress": job.progress,
            "error_message": job.error_message,
            "results": job.results,
            "model_id": job.model_id,
            "dataset_id": job.dataset_id,
            "model_name": model_name,
            "model_type": model_type,
            "dataset_name": dataset_name,
            "user_id": job.user_id,
            "created_at": job.created_at,
            "started_at": job.started_at,
            "completed_at": job.completed_at
        }
        result.append(job_dict)
    
    return result

@app.get("/jobs/{job_id}", response_model=schemas.JobWithDetails)
def get_job_details(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get job by ID with related details
    job_with_details = db.query(
        models.Job,
        models.MLModel.name.label("model_name"),
        models.MLModel.model_type.label("model_type"),
        models.Dataset.name.label("dataset_name")
    ).join(
        models.MLModel, models.Job.model_id == models.MLModel.id
    ).join(
        models.Dataset, models.Job.dataset_id == models.Dataset.id
    ).filter(
        models.Job.id == job_id,
        models.Job.user_id == current_user.id
    ).first()
    
    if not job_with_details:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job, model_name, model_type, dataset_name = job_with_details
    
    # Format the response
    result = {
        "id": job.id,
        "name": job.name,
        "description": job.description,
        "status": job.status,
        "progress": job.progress,
        "error_message": job.error_message,
        "results": job.results,
        "model_id": job.model_id,
        "dataset_id": job.dataset_id,
        "model_name": model_name,
        "model_type": model_type,
        "dataset_name": dataset_name,
        "user_id": job.user_id,
        "created_at": job.created_at,
        "started_at": job.started_at,
        "completed_at": job.completed_at
    }
    
    return result

@app.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get job by ID
    job = db.query(models.Job).filter(
        models.Job.id == job_id,
        models.Job.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Delete the job
    db.delete(job)
    db.commit()
    
    return {"message": "Job deleted successfully"}

# Start a job
@app.put("/jobs/{job_id}/start", response_model=schemas.Job)
def start_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get job by ID
    job = db.query(models.Job).filter(
        models.Job.id == job_id,
        models.Job.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Only pending jobs can be started
    if job.status != models.JobStatus.PENDING:
        raise HTTPException(status_code=400, detail=f"Cannot start job with status {job.status}")
    
    # Update job status to in progress
    job.status = models.JobStatus.IN_PROGRESS
    job.started_at = func.now()
    db.commit()
    db.refresh(job)
    
    # Start the job asynchronously
    import threading
    threading.Thread(target=run_training_job, args=(job.id,)).start()
    
    return job

@app.put("/jobs/{job_id}/cancel", response_model=schemas.Job)
def cancel_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get job by ID
    job = db.query(models.Job).filter(
        models.Job.id == job_id,
        models.Job.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Only in progress jobs can be cancelled
    if job.status != models.JobStatus.IN_PROGRESS:
        raise HTTPException(status_code=400, detail=f"Cannot cancel job with status {job.status}")
    
    # Update job status to failed (cancelled)
    job.status = models.JobStatus.FAILED
    job.error_message = "Job was cancelled by user"
    db.commit()
    db.refresh(job)
    
    return job

# Helper function to run the training job asynchronously
def run_training_job(job_id):
    # This would normally be in a separate worker process or service
    # For simplicity, we're running it in a thread here
    from sqlalchemy.orm import sessionmaker
    from .database import engine
    
    # Create a new session for this thread
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Get the job
        job = db.query(models.Job).filter(models.Job.id == job_id).first()
        if not job:
            return
        
        # Update job status to in progress
        job.status = models.JobStatus.IN_PROGRESS
        job.started_at = func.now()
        job.progress = 10
        db.commit()
        
        # Get the model and dataset
        model = db.query(models.MLModel).filter(models.MLModel.id == job.model_id).first()
        dataset = db.query(models.Dataset).filter(models.Dataset.id == job.dataset_id).first()
        
        if not model or not dataset:
            job.status = models.JobStatus.FAILED
            job.error_message = "Model or dataset not found"
            db.commit()
            return
        
        # Run the actual training - reuse the training code from train_model endpoint
        import pandas as pd
        import numpy as np
        from sklearn.preprocessing import LabelEncoder
        from sklearn.model_selection import train_test_split
        from sklearn.preprocessing import StandardScaler
        from sklearn.linear_model import LogisticRegression, LinearRegression
        from sklearn.svm import SVC, SVR
        from sklearn.neural_network import MLPClassifier, MLPRegressor
        from sklearn.cluster import KMeans, DBSCAN
        from sklearn.decomposition import PCA
        from sklearn.metrics import accuracy_score, precision_score, f1_score, mean_absolute_error, mean_squared_error, r2_score, silhouette_score
        
        try:
            # Convert dataset to DataFrame
            df = pd.DataFrame(dataset.data)
            job.progress = 20
            db.commit()
            
            # Preprocessing - Binary encoding for categorical variables
            encoders = {}
            for column in df.columns:
                if df[column].dtype == 'object':
                    encoder = LabelEncoder()
                    df[column] = encoder.fit_transform(df[column].astype(str))
                    encoders[column] = encoder
            
            job.progress = 30
            db.commit()
            
            # Feature selection - use job's feature_columns if provided, otherwise fall back to model's
            feature_columns = job.feature_columns or model.feature_columns or df.columns.tolist()
            target_column = job.target_column or model.target_column
            
            if target_column and target_column in feature_columns:
                feature_columns.remove(target_column)
            
            X = df[feature_columns]
            job.progress = 40
            db.commit()
            
            # For supervised learning, prepare target variable
            if model.task_type in [schemas.ModelTaskType.CLASSIFICATION, schemas.ModelTaskType.REGRESSION]:
                if not target_column:
                    job.status = models.JobStatus.FAILED
                    job.error_message = "Target column required for supervised learning"
                    job.completed_at = func.now()
                    db.commit()
                    return
                
                y = df[target_column]
                
                # Split data
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y, test_size=0.2, random_state=model.hyperparameters.get('random_state', 42)
                )
                
                job.progress = 50
                db.commit()
                
                # Normalize features
                scaler = StandardScaler()
                X_train = scaler.fit_transform(X_train)
                X_test = scaler.transform(X_test)
                
                # Train model based on type
                model_type = model.model_type
                hyperparams = model.hyperparameters
                
                job.progress = 60
                db.commit()
                
                if model.task_type == schemas.ModelTaskType.CLASSIFICATION:
                    if model_type == schemas.ModelType.LOGISTIC_REGRESSION:
                        sklearn_model = LogisticRegression(
                            C=hyperparams.get('C', 1.0),
                            penalty=hyperparams.get('penalty', 'l2'),
                            solver=hyperparams.get('solver', 'lbfgs'),
                            max_iter=hyperparams.get('max_iter', 100),
                            random_state=hyperparams.get('random_state', 42)
                        )
                    elif model_type == schemas.ModelType.SVM:
                        sklearn_model = SVC(
                            C=hyperparams.get('C', 1.0),
                            kernel=hyperparams.get('kernel', 'rbf'),
                            gamma=hyperparams.get('gamma', 'scale'),
                            random_state=hyperparams.get('random_state', 42)
                        )
                    elif model_type == schemas.ModelType.NEURAL_NETWORK:
                        sklearn_model = MLPClassifier(
                            hidden_layer_sizes=hyperparams.get('hidden_layer_sizes', (100,)),
                            activation=hyperparams.get('activation', 'relu'),
                            learning_rate=hyperparams.get('learning_rate', 'constant'),
                            learning_rate_init=hyperparams.get('learning_rate_init', 0.001),
                            max_iter=hyperparams.get('max_iter', 200),
                            random_state=hyperparams.get('random_state', 42)
                        )
                    else:
                        raise ValueError("Unsupported model type for classification")
                    
                    job.progress = 70
                    db.commit()
                    
                    # Train model
                    sklearn_model.fit(X_train, y_train)
                    
                    job.progress = 90
                    db.commit()
                    
                    # Evaluate model
                    y_pred = sklearn_model.predict(X_test)
                    metrics = {
                        'accuracy': float(accuracy_score(y_test, y_pred)),
                        'precision': float(precision_score(y_test, y_pred, average='weighted', zero_division=0)),
                        'f1': float(f1_score(y_test, y_pred, average='weighted', zero_division=0))
                    }
                    
                elif model.task_type == schemas.ModelTaskType.REGRESSION:
                    if model_type == schemas.ModelType.LOGISTIC_REGRESSION:
                        sklearn_model = LinearRegression()
                    elif model_type == schemas.ModelType.SVR:
                        sklearn_model = SVR(
                            C=hyperparams.get('C', 1.0),
                            kernel=hyperparams.get('kernel', 'rbf'),
                            gamma=hyperparams.get('gamma', 'scale')
                        )
                    elif model_type == schemas.ModelType.NEURAL_NETWORK:
                        sklearn_model = MLPRegressor(
                            hidden_layer_sizes=hyperparams.get('hidden_layer_sizes', (100,)),
                            activation=hyperparams.get('activation', 'relu'),
                            learning_rate=hyperparams.get('learning_rate', 'constant'),
                            learning_rate_init=hyperparams.get('learning_rate_init', 0.001),
                            max_iter=hyperparams.get('max_iter', 200),
                            random_state=hyperparams.get('random_state', 42)
                        )
                    else:
                        raise ValueError("Unsupported model type for regression")
                    
                    job.progress = 70
                    db.commit()
                    
                    # Train model
                    sklearn_model.fit(X_train, y_train)
                    
                    job.progress = 90
                    db.commit()
                    
                    # Evaluate model
                    y_pred = sklearn_model.predict(X_test)
                    metrics = {
                        'mae': float(mean_absolute_error(y_test, y_pred)),
                        'mse': float(mean_squared_error(y_test, y_pred)),
                        'r2': float(r2_score(y_test, y_pred))
                    }
                
            else:  # Unsupervised learning
                # Normalize features
                scaler = StandardScaler()
                X_scaled = scaler.fit_transform(X)
                
                job.progress = 50
                db.commit()
                
                # No test-train split for unsupervised learning
                if model.task_type == schemas.ModelTaskType.CLUSTERING:
                    if model_type == schemas.ModelType.KMEANS:
                        sklearn_model = KMeans(
                            n_clusters=hyperparams.get('n_clusters', 8),
                            init=hyperparams.get('init', 'k-means++'),
                            random_state=hyperparams.get('random_state', 42)
                        )
                        
                        job.progress = 70
                        db.commit()
                        
                        sklearn_model.fit(X_scaled)
                        
                        job.progress = 90
                        db.commit()
                        
                        labels = sklearn_model.labels_
                        metrics = {
                            'inertia': float(sklearn_model.inertia_),
                            'n_clusters': int(hyperparams.get('n_clusters', 8)),
                            'silhouette_score': float(silhouette_score(X_scaled, labels, sample_size=min(1000, X_scaled.shape[0])))
                        }
                        
                    elif model_type == schemas.ModelType.DBSCAN:
                        sklearn_model = DBSCAN(
                            eps=hyperparams.get('eps', 0.5),
                            min_samples=hyperparams.get('min_samples', 5)
                        )
                        
                        job.progress = 70
                        db.commit()
                        
                        sklearn_model.fit(X_scaled)
                        
                        job.progress = 90
                        db.commit()
                        
                        labels = sklearn_model.labels_
                        n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
                        metrics = {
                            'n_clusters': int(n_clusters),
                            'n_noise': int(list(labels).count(-1))
                        }
                        
                elif model.task_type == schemas.ModelTaskType.DIMENSIONALITY_REDUCTION:
                    if model_type == schemas.ModelType.PCA:
                        sklearn_model = PCA(
                            n_components=hyperparams.get('n_components', 2)
                        )
                        
                        job.progress = 70
                        db.commit()
                        
                        X_transformed = sklearn_model.fit_transform(X_scaled)
                        
                        job.progress = 90
                        db.commit()
                        
                        metrics = {
                            'explained_variance_ratio': [float(v) for v in sklearn_model.explained_variance_ratio_],
                            'n_components': int(hyperparams.get('n_components', 2))
                        }
            
            # Update job as completed
            job.status = models.JobStatus.COMPLETED
            job.progress = 100
            job.completed_at = func.now()
            job.results = metrics
            
            # Update the model as trained
            model.is_trained = True
            model.training_accuracy = metrics.get('accuracy') or metrics.get('r2')
            model.evaluation_metrics = metrics
            
            db.commit()
            
        except Exception as e:
            # Handle any errors during training
            job.status = models.JobStatus.FAILED
            job.error_message = str(e)
            db.commit()
            
    except Exception as e:
        # Handle any database errors
        import traceback
        print(f"Error during training job: {str(e)}")
        print(traceback.format_exc())
    finally:
        db.close()

# API Key Endpoints
@app.post("/api-keys/", response_model=schemas.APIKey)
def create_api_key(
    api_key: schemas.APIKeyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Generate a random API key
    import secrets
    import string
    
    # Create a random string of characters for the API key
    alphabet = string.ascii_letters + string.digits
    key = ''.join(secrets.choice(alphabet) for _ in range(32))
    
    # Create the API key in the database
    db_api_key = models.APIKey(
        name=api_key.name,
        key=key,
        usage_count=0,
        expires_at=api_key.expires_at,
        user_id=current_user.id
    )
    
    db.add(db_api_key)
    db.commit()
    db.refresh(db_api_key)
    
    return db_api_key

@app.get("/api-keys/", response_model=List[schemas.APIKey])
def get_user_api_keys(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    api_keys = db.query(models.APIKey).filter(
        models.APIKey.user_id == current_user.id
    ).all()
    
    return api_keys

@app.delete("/api-keys/{api_key_id}")
def delete_api_key(
    api_key_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get API key by ID
    api_key = db.query(models.APIKey).filter(
        models.APIKey.id == api_key_id,
        models.APIKey.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    # Delete the API key
    db.delete(api_key)
    db.commit()
    
    return {"message": "API key deleted successfully"} 