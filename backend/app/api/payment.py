from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.api.auth import get_current_user
from app.db.models.user import User
from app.db.models.invoice import Invoice
from app.db.models.order import RentalOrder
from app.core.config import settings
import razorpay
from pydantic import BaseModel

router = APIRouter()

def get_razorpay_client():
    """Get Razorpay client with current credentials"""
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Razorpay credentials not configured"
        )
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class PaymentCreate(BaseModel):
    amount: int  # Amount in paise (e.g., 50000 for ₹500.00)
    currency: str = "INR"
    receipt: str

@router.post("/create-order")
async def create_razorpay_order(
    item: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print(f"Items: {item}")
    try:
        # Debug Credentials (Masked)
        key_id = settings.RAZORPAY_KEY_ID
        key_secret = settings.RAZORPAY_KEY_SECRET
        print(f"DEBUG: Razorpay Key ID present: {bool(key_id)}")
        print(f"DEBUG: Razorpay Secret present: {bool(key_secret)}")
        if key_id:
            print(f"DEBUG: Razorpay Key ID starts with: {key_id[:8]}...")

        razorpay_client = get_razorpay_client()

        data = {
            "amount": item.amount,
            "currency": item.currency,
            "receipt": item.receipt,
            "notes": {
                "user_id": str(current_user.id),
                "email": current_user.email
            }
        }
        print(f"DEBUG: Creating Razorpay order with data: {data}")
        
        # Create Razorpay Order
        order = razorpay_client.order.create(data=data)
        print(f"DEBUG: Razorpay Order Created: {order}")
        
        return {
            "id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "receipt": order["receipt"],
            "key_id": settings.RAZORPAY_KEY_ID
        }
    except razorpay.errors.BadRequestError as e:
        print(f"ERROR: Razorpay BadRequest: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid payment request: {str(e)}"
        )
    except razorpay.errors.ServerError as e:
        print(f"ERROR: Razorpay ServerError: {e}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Razorpay server error. Please try again."
        )
    except Exception as e:
        print(f"ERROR: General Payment Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment Error: {str(e)}"
        )
