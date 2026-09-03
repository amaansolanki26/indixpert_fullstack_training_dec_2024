from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ==================== CREATE SCHEMA ====================
class AdminCreate(BaseModel):
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Full name of the admin"
    )
    
    email: EmailStr = Field(
        ...,
        description="Valid email address"
    )
    
    password_hash: str = Field(
        ...,
        min_length=50,
        max_length=255,
        description="Hashed password (from Cognito or manual)"
    )
    
    cognito_sub: str = Field(
        ...,
        min_length=10,
        description="AWS Cognito User Sub"
    )
    
    role: str = Field(
        default="Admin",
        pattern="^Admin$",
        description="Role must be 'Admin'"
    )



# ==================== UPDATE SCHEMA ====================
class AdminUpdate(BaseModel):
    full_name: Optional[str] = Field(
        None,
        min_length=2,
        max_length=100
    )
    
    email: Optional[EmailStr] = None
    
    role: Optional[str] = Field(
        None,
        pattern="^Admin$"
    )
    
    is_active: Optional[bool] = None


# ==================== RESPONSE SCHEMA ====================
class AdminResponse(BaseModel):
    admin_id: int
    cognito_sub: str
    full_name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


# ==================== LIST RESPONSE ====================
class AdminListResponse(BaseModel):
    admins: list[AdminResponse]


# Optional: For Login / Get by Email
class AdminLoginResponse(BaseModel):
    admin_id: int
    cognito_sub: str
    full_name: str
    email: EmailStr
    role: str
    is_active: bool