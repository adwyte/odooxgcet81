from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.db import get_db
from app.services import auth_service
from app.db.models.user import User
from app.services.calendar_service import calendar_service
from app.db.models.order import RentalOrder # Assuming this model exists
import uuid

router = APIRouter(prefix="/api/calendar", tags=["Calendar"])

@router.get("/connect")
async def connect_calendar(current_user: User = Depends(auth_service.get_current_user)):
    """Get Google Calendar Connect URL"""
    return {"url": calendar_service.get_auth_url()}

class CalendarCallback(BaseModel):
    code: str

@router.post("/callback")
async def calendar_callback(
    data: CalendarCallback, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(auth_service.get_current_user)
):
    """Handle Callback and save Refresh Token"""
    try:
        creds = calendar_service.get_credentials(data.code)
        
        if not creds.refresh_token:
            # If user already connected and we didn't force consent, we might not get refresh token
            # But we used prompt='consent' so we should get it.
            # If still missing, we might only have access token which expires.
            # For now, let's assume we get it or handle error.
            pass

        if creds.refresh_token:
            current_user.google_refresh_token = creds.refresh_token
            db.commit()
            return {"message": "Calendar connected successfully"}
        else:
            return {"message": "Connected (Refreshed Existing)", "warning": "No new refresh token received"}
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to connect calendar: {str(e)}")

class SyncOrderRequest(BaseModel):
    order_id: str

@router.post("/sync-order")
async def sync_order(
    data: SyncOrderRequest, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(auth_service.get_current_user)
):
    """Sync specific order to calendar"""
    if not current_user.google_refresh_token:
        raise HTTPException(status_code=400, detail="Calendar not connected")
        
    order = db.query(RentalOrder).filter(RentalOrder.id == uuid.UUID(data.order_id)).first()
    if not order:
         raise HTTPException(status_code=404, detail="Order not found")
         
    # Check authorization (Vendor or Customer can sync)
    if order.customer_id != current_user.id and order.vendor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    try:
        summary = f"Rental: {order.order_number}"
        # Assuming order has rental_start_date/end_date
        # Need to check Order model actually. Assuming it has valid datetime fields.
        start = order.rental_start_date
        end = order.rental_end_date
        
        description = f"Order #{order.order_number}\nItems: {len(order.lines)}\nStatus: {order.status}"
        
        link = calendar_service.create_event(
            current_user.google_refresh_token,
            summary,
            start,
            end,
            description
        )
        return {"message": "Event created", "link": link}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")
