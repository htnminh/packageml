from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, JSON
from sqlalchemy.sql import func
from .database import Base

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