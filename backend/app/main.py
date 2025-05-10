from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import json
import random
import string
from typing import List

from . import models, schemas, auth
from .database import engine, get_db

# Create tables in the database
models.Base.metadata.create_all(bind=engine)

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
            "filename": "products.json",
            "file_type": "JSON"
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
    file_type: str = Form(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Read file content
    content = await file.read()
    
    # Parse file based on type
    try:
        if file_type.upper() == "CSV":
            import pandas as pd
            import io
            df = pd.read_csv(io.StringIO(content.decode('utf-8')))
            data = df.to_dict(orient="records")
        elif file_type.upper() == "JSON":
            import json
            data = json.loads(content.decode('utf-8'))
            if not isinstance(data, list):
                data = [data]  # Convert single object to list
        elif file_type.upper() == "EXCEL":
            import pandas as pd
            import io
            df = pd.read_excel(io.BytesIO(content))
            data = df.to_dict(orient="records")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
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
    size = len(json.dumps(data))
    
    # Create new dataset
    db_dataset = models.Dataset(
        name=name,
        filename=file.filename,
        description=description or "",
        data=data,
        schema=schema,
        rows=len(data),
        columns=len(schema),
        size=size,
        file_type=file_type.upper(),
        tags="",
        missing_values=sum(col["missing"] for col in schema),
        user_id=current_user.id
    )
    
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset 