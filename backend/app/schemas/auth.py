from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    VENDOR = "VENDOR"
    CUSTOMER = "CUSTOMER"

# Request Schemas
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    company_name: Optional[str] = None
    business_category: Optional[str] = None
    gstin: Optional[str] = None
    role: UserRole = UserRole.CUSTOMER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

class PasswordReset(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class TokenRefresh(BaseModel):
    refresh_token: str

class OAuthCallback(BaseModel):
    code: str
    state: Optional[str] = None

# Response Schemas
class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    role: UserRole
    company_name: Optional[str] = None
    business_category: Optional[str] = None
    gstin: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

class MessageResponse(BaseModel):
    message: str
    success: bool = True

class OTPResponse(BaseModel):
    message: str
    expires_in_minutes: int
