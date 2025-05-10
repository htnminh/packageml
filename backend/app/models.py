from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, JSON, Enum, Float
from sqlalchemy.sql import func
from .database import Base
import enum

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    salt = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    filename = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    data = Column(JSON, nullable=False)  # Store the actual dataset as JSON
    schema = Column(JSON, nullable=False)  # Store column definitions
    rows = Column(Integer, nullable=False)
    columns = Column(Integer, nullable=False)
    size = Column(Integer, nullable=False)  # Size in bytes
    file_type = Column(String(50), nullable=False)  # CSV, JSON, Excel
    tags = Column(String(255), nullable=True)
    missing_values = Column(Integer, default=0)
    used_in_jobs = Column(Integer, default=0)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ModelTaskType(str, enum.Enum):
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    CLUSTERING = "clustering"
    DIMENSIONALITY_REDUCTION = "dimensionality_reduction"

class ModelType(str, enum.Enum):
    LOGISTIC_REGRESSION = "logistic_regression"
    SVM = "svm"
    NEURAL_NETWORK = "neural_network"
    SVR = "svr"
    KMEANS = "kmeans"
    DBSCAN = "dbscan"
    PCA = "pca"

class MLModel(Base):
    __tablename__ = "ml_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Model type and task information
    model_type = Column(Enum(ModelType), nullable=False)
    task_type = Column(Enum(ModelTaskType), nullable=False)
    
    # Hyperparameters stored as JSON
    hyperparameters = Column(JSON, nullable=False)
    
    # Target column for supervised learning
    target_column = Column(String(255), nullable=True)  # Null for unsupervised models
    
    # Selected features
    feature_columns = Column(JSON, nullable=True)  # List of column names to use as features
    
    # Training status
    is_trained = Column(Boolean, default=False)
    training_accuracy = Column(Float, nullable=True)
    evaluation_metrics = Column(JSON, nullable=True)  # Store various metrics as JSON
    
    # Relationships
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class JobStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Status and progress
    status = Column(Enum(JobStatus), default=JobStatus.PENDING)
    progress = Column(Integer, default=0)  # 0-100
    error_message = Column(Text, nullable=True)
    
    # Associated model and data
    model_id = Column(Integer, ForeignKey("ml_models.id"), nullable=False)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    
    # Training-specific configuration
    target_column = Column(String(255), nullable=True)
    feature_columns = Column(JSON, nullable=True)
    
    # Results and metrics
    results = Column(JSON, nullable=True)  # Store results in various formats
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # User who created the job
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    key = Column(String(255), nullable=False, unique=True)
    usage_count = Column(Integer, default=0)
    expires_at = Column(DateTime(timezone=True), nullable=True)  # Null means never expires
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_used_at = Column(DateTime(timezone=True), nullable=True) 