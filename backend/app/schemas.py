from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

class ModelTaskType(str, Enum):
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    CLUSTERING = "clustering"
    DIMENSIONALITY_REDUCTION = "dimensionality_reduction"

class ModelType(str, Enum):
    LOGISTIC_REGRESSION = "logistic_regression"
    SVM = "svm" 
    NEURAL_NETWORK = "neural_network"
    SVR = "svr"
    KMEANS = "kmeans"
    DBSCAN = "dbscan"
    PCA = "pca"

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

class ColumnSchema(BaseModel):
    name: str
    type: str
    missing: int = 0
    example: Optional[str] = None

class DatasetBase(BaseModel):
    name: str
    description: Optional[str] = None
    tags: Optional[str] = None

class DatasetCreate(DatasetBase):
    data: List[Dict[str, Any]]
    filename: str
    file_type: str

class RandomDatasetCreate(BaseModel):
    dataset_type: str  # "Customer Data", "Sales Data", or "Product Catalog"
    num_rows: int

class Dataset(DatasetBase):
    id: int
    filename: str
    rows: int
    columns: int
    size: int
    file_type: str
    missing_values: int
    used_in_jobs: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class DatasetDetails(Dataset):
    column_schema: List[ColumnSchema]
    sample_data: List[Dict[str, Any]]
    
    class Config:
        orm_mode = True

# ML Model Schemas
class ModelHyperparameters(BaseModel):
    # Common hyperparameters
    random_state: Optional[int] = 42
    
    # Classification/Regression - Logistic Regression
    C: Optional[float] = 1.0
    penalty: Optional[str] = "l2"
    solver: Optional[str] = "lbfgs"
    max_iter: Optional[int] = 100
    
    # Classification/Regression - SVM/SVR
    kernel: Optional[str] = "rbf"
    gamma: Optional[str] = "scale"
    
    # Neural Network
    hidden_layer_sizes: Optional[List[int]] = [100]
    activation: Optional[str] = "relu"
    learning_rate: Optional[str] = "constant"
    learning_rate_init: Optional[float] = 0.001
    
    # Clustering - KMeans
    n_clusters: Optional[int] = 8
    init: Optional[str] = "k-means++"
    
    # Clustering - DBSCAN
    eps: Optional[float] = 0.5
    min_samples: Optional[int] = 5
    
    # Dimensionality Reduction - PCA
    n_components: Optional[int] = 2
    
    class Config:
        extra = "allow"  # Allow extra fields

class ModelBase(BaseModel):
    name: str
    description: Optional[str] = None
    model_type: ModelType
    task_type: ModelTaskType
    dataset_id: Optional[int] = None
    target_column: Optional[str] = None
    feature_columns: Optional[List[str]] = None
    hyperparameters: ModelHyperparameters

class ModelCreate(ModelBase):
    pass

class ModelUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    hyperparameters: Optional[ModelHyperparameters] = None
    target_column: Optional[str] = None
    feature_columns: Optional[List[str]] = None

class Model(ModelBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_trained: bool = False
    training_accuracy: Optional[float] = None
    evaluation_metrics: Optional[Dict[str, Any]] = None
    
    class Config:
        orm_mode = True

class ModelWithDataset(Model):
    dataset_name: Optional[str] = None
    
    class Config:
        orm_mode = True

# Job schemas
class JobStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class JobBase(BaseModel):
    name: str
    description: Optional[str] = None
    model_id: int
    dataset_id: Optional[int] = None  # Optional because we might get it from the model
    target_column: Optional[str] = None
    feature_columns: Optional[List[str]] = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    status: Optional[JobStatus] = None
    progress: Optional[int] = None
    error_message: Optional[str] = None
    results: Optional[Dict[str, Any]] = None
    completed_at: Optional[datetime] = None

class Job(JobBase):
    id: int
    status: JobStatus
    progress: int
    error_message: Optional[str] = None
    results: Optional[Dict[str, Any]] = None
    user_id: int
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class JobWithDetails(Job):
    model_name: str
    model_type: str
    dataset_name: str
    
    class Config:
        orm_mode = True

# API Key schemas
class APIKeyBase(BaseModel):
    name: str

class APIKeyCreate(APIKeyBase):
    expires_at: Optional[datetime] = None

class APIKey(APIKeyBase):
    id: int
    key: str
    usage_count: int
    expires_at: Optional[datetime] = None
    user_id: int
    created_at: datetime
    last_used_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True 