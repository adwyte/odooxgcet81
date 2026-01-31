from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List
from pydantic import BaseModel
from datetime import datetime, timedelta

from app.db import get_db
from app.db.models.product import Product
from app.db.models.order import RentalOrder, OrderStatus
from app.db.models.invoice import Invoice, InvoiceStatus
from app.db.models.user import User, UserRole
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# =====================
# Schemas
# =====================

class TopProduct(BaseModel):
    name: str
    rentals: int


class RevenueByMonth(BaseModel):
    month: str
    revenue: float


class OrdersByStatus(BaseModel):
    status: str
    count: int


class DashboardStatsResponse(BaseModel):
    total_revenue: float
    total_orders: int
    active_rentals: int
    pending_returns: int
    total_products: int
    top_products: List[TopProduct]
    revenue_by_month: List[RevenueByMonth]
    orders_by_status: List[OrdersByStatus]


# =====================
# Endpoints
# =====================

@router.get("/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard statistics"""
    
    # Base queries depending on user role
    orders_query = db.query(RentalOrder)
    products_query = db.query(Product)
    invoices_query = db.query(Invoice)
    
    if current_user.role == UserRole.CUSTOMER:
        orders_query = orders_query.filter(RentalOrder.customer_id == current_user.id)
        invoices_query = invoices_query.filter(Invoice.customer_id == current_user.id)
    elif current_user.role == UserRole.VENDOR:
        orders_query = orders_query.filter(RentalOrder.vendor_id == current_user.id)
        products_query = products_query.filter(Product.vendor_id == current_user.id)
    # Admin sees all
    
    # Total revenue from paid invoices
    total_revenue = db.query(func.coalesce(func.sum(Invoice.paid_amount), 0)).scalar() or 0
    if current_user.role == UserRole.CUSTOMER:
        total_revenue = invoices_query.with_entities(func.coalesce(func.sum(Invoice.paid_amount), 0)).scalar() or 0
    
    # Total orders
    total_orders = orders_query.count()
    
    # Active rentals (PICKED_UP or ACTIVE status)
    active_rentals = orders_query.filter(
        RentalOrder.status.in_([OrderStatus.PICKED_UP, OrderStatus.ACTIVE])
    ).count()
    
    # Pending returns
    pending_returns = orders_query.filter(
        RentalOrder.status == OrderStatus.RETURNED
    ).count()
    
    # Total products
    total_products = products_query.count()
    
    # Top products by rental count
    from app.db.models.order import OrderLine
    top_products_query = db.query(
        OrderLine.product_name,
        func.count(OrderLine.id).label('rentals')
    ).group_by(OrderLine.product_name).order_by(func.count(OrderLine.id).desc()).limit(5).all()
    
    top_products = [
        TopProduct(name=p[0] or "Unknown", rentals=p[1])
        for p in top_products_query
    ]
    
    # Fill with placeholder if no data
    if not top_products:
        top_products = [
            TopProduct(name="No data", rentals=0)
        ]
    
    # Revenue by month (last 6 months)
    revenue_by_month = []
    current_date = datetime.now()
    
    for i in range(5, -1, -1):
        month_date = current_date - timedelta(days=i * 30)
        month_name = month_date.strftime("%b")
        
        month_revenue = db.query(func.coalesce(func.sum(Invoice.paid_amount), 0)).filter(
            extract('month', Invoice.created_at) == month_date.month,
            extract('year', Invoice.created_at) == month_date.year
        ).scalar() or 0
        
        revenue_by_month.append(RevenueByMonth(month=month_name, revenue=float(month_revenue)))
    
    # Orders by status
    status_counts = db.query(
        RentalOrder.status,
        func.count(RentalOrder.id)
    ).group_by(RentalOrder.status).all()
    
    orders_by_status = [
        OrdersByStatus(status=s[0].value if s[0] else "UNKNOWN", count=s[1])
        for s in status_counts
    ]
    
    # Add missing statuses with 0 count
    existing_statuses = {o.status for o in orders_by_status}
    for status in OrderStatus:
        if status.value not in existing_statuses:
            orders_by_status.append(OrdersByStatus(status=status.value, count=0))
    
    return DashboardStatsResponse(
        total_revenue=float(total_revenue),
        total_orders=total_orders,
        active_rentals=active_rentals,
        pending_returns=pending_returns,
        total_products=total_products,
        top_products=top_products,
        revenue_by_month=revenue_by_month,
        orders_by_status=orders_by_status
    )


@router.get("/recent-orders")
async def get_recent_orders(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get recent orders"""
    from app.api.orders import order_to_response
    
    query = db.query(RentalOrder)
    
    if current_user.role == UserRole.CUSTOMER:
        query = query.filter(RentalOrder.customer_id == current_user.id)
    elif current_user.role == UserRole.VENDOR:
        query = query.filter(RentalOrder.vendor_id == current_user.id)
    
    orders = query.order_by(RentalOrder.created_at.desc()).limit(limit).all()
    
    return [order_to_response(o) for o in orders]
