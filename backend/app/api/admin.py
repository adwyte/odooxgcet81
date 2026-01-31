from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
from enum import Enum

from app.db import get_db
from app.db.models.user import User, UserRole
from app.services.auth_service import get_password_hash, get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])


# Dependency to check if user is admin
async def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


# =====================
# Schemas
# =====================

class UserStatusUpdate(BaseModel):
    is_active: bool


class UserRoleUpdate(BaseModel):
    role: UserRole


class VendorApproval(BaseModel):
    approved: bool
    rejection_reason: Optional[str] = None


class AdminUserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: UserRole
    company_name: Optional[str] = None
    business_category: Optional[str] = None
    gstin: Optional[str] = None


class UserListResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    role: str
    company_name: Optional[str]
    business_category: Optional[str]
    gstin: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_users: int
    total_vendors: int
    total_customers: int
    active_users: int
    new_users_this_month: int
    new_vendors_this_month: int


class PaginatedResponse(BaseModel):
    items: List[UserListResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


# =====================
# Dashboard Endpoints
# =====================

@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Get admin dashboard statistics"""
    now = datetime.utcnow()
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    total_users = db.query(func.count(User.id)).scalar()
    total_vendors = db.query(func.count(User.id)).filter(User.role == UserRole.VENDOR).scalar()
    total_customers = db.query(func.count(User.id)).filter(User.role == UserRole.CUSTOMER).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    
    new_users_this_month = db.query(func.count(User.id)).filter(
        User.created_at >= start_of_month
    ).scalar()
    
    new_vendors_this_month = db.query(func.count(User.id)).filter(
        User.role == UserRole.VENDOR,
        User.created_at >= start_of_month
    ).scalar()
    
    return DashboardStats(
        total_users=total_users or 0,
        total_vendors=total_vendors or 0,
        total_customers=total_customers or 0,
        active_users=active_users or 0,
        new_users_this_month=new_users_this_month or 0,
        new_vendors_this_month=new_vendors_this_month or 0
    )


# =====================
# User Management Endpoints
# =====================

@router.get("/users", response_model=PaginatedResponse)
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    role: Optional[UserRole] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """List all users with pagination and filters"""
    query = db.query(User)
    
    # Apply filters
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (User.first_name.ilike(search_filter)) |
            (User.last_name.ilike(search_filter)) |
            (User.email.ilike(search_filter)) |
            (User.company_name.ilike(search_filter))
        )
    
    if role:
        query = query.filter(User.role == role)
    
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    users = query.order_by(desc(User.created_at)).offset((page - 1) * per_page).limit(per_page).all()
    
    total_pages = (total + per_page - 1) // per_page
    
    return PaginatedResponse(
        items=[UserListResponse(
            id=str(user.id),
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            role=user.role.value,
            company_name=user.company_name,
            business_category=user.business_category,
            gstin=user.gstin,
            is_active=user.is_active,
            created_at=user.created_at
        ) for user in users],
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )


@router.get("/users/{user_id}", response_model=UserListResponse)
async def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Get a specific user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserListResponse(
        id=str(user.id),
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        role=user.role.value,
        company_name=user.company_name,
        business_category=user.business_category,
        gstin=user.gstin,
        is_active=user.is_active,
        created_at=user.created_at
    )


@router.post("/users", response_model=UserListResponse)
async def create_user(
    user_data: AdminUserCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Create a new user (admin only - can create any role including admin)"""
    # Check if email exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        role=user_data.role,
        company_name=user_data.company_name,
        business_category=user_data.business_category,
        gstin=user_data.gstin,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return UserListResponse(
        id=str(user.id),
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        role=user.role.value,
        company_name=user.company_name,
        business_category=user.business_category,
        gstin=user.gstin,
        is_active=user.is_active,
        created_at=user.created_at
    )


@router.patch("/users/{user_id}/status", response_model=UserListResponse)
async def update_user_status(
    user_id: str,
    status_update: UserStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Activate or deactivate a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deactivating yourself
    if str(user.id) == str(admin.id) and not status_update.is_active:
        raise HTTPException(status_code=400, detail="Cannot deactivate your own account")
    
    user.is_active = status_update.is_active
    db.commit()
    db.refresh(user)
    
    return UserListResponse(
        id=str(user.id),
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        role=user.role.value,
        company_name=user.company_name,
        business_category=user.business_category,
        gstin=user.gstin,
        is_active=user.is_active,
        created_at=user.created_at
    )


@router.patch("/users/{user_id}/role", response_model=UserListResponse)
async def update_user_role(
    user_id: str,
    role_update: UserRoleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Change a user's role"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent changing your own role
    if str(user.id) == str(admin.id):
        raise HTTPException(status_code=400, detail="Cannot change your own role")
    
    user.role = role_update.role
    db.commit()
    db.refresh(user)
    
    return UserListResponse(
        id=str(user.id),
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        role=user.role.value,
        company_name=user.company_name,
        business_category=user.business_category,
        gstin=user.gstin,
        is_active=user.is_active,
        created_at=user.created_at
    )


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Delete a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deleting yourself
    if str(user.id) == str(admin.id):
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}


# =====================
# Vendor Management Endpoints
# =====================

@router.get("/vendors", response_model=PaginatedResponse)
async def list_vendors(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """List all vendors with pagination"""
    query = db.query(User).filter(User.role == UserRole.VENDOR)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (User.first_name.ilike(search_filter)) |
            (User.last_name.ilike(search_filter)) |
            (User.email.ilike(search_filter)) |
            (User.company_name.ilike(search_filter))
        )
    
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    total = query.count()
    vendors = query.order_by(desc(User.created_at)).offset((page - 1) * per_page).limit(per_page).all()
    total_pages = (total + per_page - 1) // per_page
    
    return PaginatedResponse(
        items=[UserListResponse(
            id=str(v.id),
            first_name=v.first_name,
            last_name=v.last_name,
            email=v.email,
            role=v.role.value,
            company_name=v.company_name,
            business_category=v.business_category,
            gstin=v.gstin,
            is_active=v.is_active,
            created_at=v.created_at
        ) for v in vendors],
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )


@router.post("/vendors/{vendor_id}/approve")
async def approve_vendor(
    vendor_id: str,
    approval: VendorApproval,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Approve or reject a vendor"""
    vendor = db.query(User).filter(User.id == vendor_id, User.role == UserRole.VENDOR).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    vendor.is_active = approval.approved
    db.commit()
    
    action = "approved" if approval.approved else "rejected"
    return {"message": f"Vendor {action} successfully"}
