from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File
)
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from pathlib import Path
import uuid
import shutil

from app.db.session import SessionLocal
from app.core.config import settings
from app.schemas.auth import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    OTPRequest, OTPVerify, PasswordReset, TokenRefresh,
    MessageResponse, OTPResponse, ReferralCodeValidation,
    UserUpdate
)
from app.services import auth_service, email_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# -------------------- DB Dependency --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- Auth Routes --------------------
@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = auth_service.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    if user_data.referral_code:
        referrer = auth_service.get_user_by_referral_code(db, user_data.referral_code)
        if not referrer or referrer.referral_used:
            raise HTTPException(status_code=400, detail="Invalid referral code")

    user = auth_service.create_user(db, user_data)

    return TokenResponse(
        access_token=auth_service.create_access_token({"sub": str(user.id)}),
        refresh_token=auth_service.create_refresh_token({"sub": str(user.id)}),
        user=auth_service.user_to_response(user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    return TokenResponse(
        access_token=auth_service.create_access_token({"sub": str(user.id)}),
        refresh_token=auth_service.create_refresh_token({"sub": str(user.id)}),
        user=auth_service.user_to_response(user),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(token_data: TokenRefresh, db: Session = Depends(get_db)):
    payload = auth_service.verify_token(token_data.refresh_token, token_type="refresh")
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = auth_service.get_user_by_id(db, payload["sub"])
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User inactive")

    return TokenResponse(
        access_token=auth_service.create_access_token({"sub": str(user.id)}),
        refresh_token=auth_service.create_refresh_token({"sub": str(user.id)}),
        user=auth_service.user_to_response(user),
    )


# -------------------- OTP Password Reset --------------------
@router.post("/forgot-password", response_model=OTPResponse)
async def forgot_password(request: OTPRequest, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, request.email)
    if user:
        otp = auth_service.store_otp(request.email)
        email_service.send_otp_email(request.email, otp)
        print(f"[DEBUG] OTP for {request.email}: {otp}")

    return OTPResponse(
        message="If the email exists, an OTP has been sent",
        expires_in_minutes=settings.OTP_EXPIRE_MINUTES,
    )


@router.post("/verify-otp", response_model=MessageResponse)
async def verify_otp(request: OTPVerify):
    if not auth_service.verify_otp(request.email, request.otp, consume=False):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    return MessageResponse(message="OTP verified successfully", success=True)


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(request: PasswordReset, db: Session = Depends(get_db)):
    if not auth_service.verify_otp(request.email, request.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = auth_service.get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    auth_service.update_user_password(db, user, request.new_password)
    return MessageResponse(message="Password reset successfully", success=True)


# -------------------- OAuth --------------------
@router.get("/google")
async def google_login():
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google OAuth not configured")
    return RedirectResponse(auth_service.get_google_oauth_url())


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    try:
        user_info = await auth_service.get_google_user_info(code)
        user = auth_service.get_or_create_oauth_user(db, user_info, "google")

        return RedirectResponse(
            f"{settings.FRONTEND_URL}/oauth/callback"
            f"?access_token={auth_service.create_access_token({'sub': str(user.id)})}"
            f"&refresh_token={auth_service.create_refresh_token({'sub': str(user.id)})}"
        )
    except Exception:
        return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_failed")


# -------------------- Profile --------------------
@router.get("/me", response_model=UserResponse)
async def get_current_user(
    current_user=Depends(auth_service.get_current_user),
):
    return auth_service.user_to_response(current_user)


async def update_current_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(auth_service.get_current_user),
):
    updated = auth_service.update_user_profile(db, current_user, user_update)
    return auth_service.user_to_response(updated)


# -------------------- Profile Photo Upload --------------------
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@router.post("/profile-photo", response_model=UserResponse)
async def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(auth_service.get_current_user),
):
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type")

    filename = f"profile_{current_user.id}_{uuid.uuid4()}{ext}"
    path = UPLOAD_DIR / filename

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_user.profile_photo = f"/uploads/{filename}"
    db.commit()
    db.refresh(current_user)

    return auth_service.user_to_response(current_user)
