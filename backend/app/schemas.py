from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

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