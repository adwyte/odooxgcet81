from datetime import datetime, timedelta
from typing import Optional, Tuple
import secrets
import random
import string
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from authlib.integrations.requests_client import OAuth2Session

from app.core.config import settings
from app.db.models.user import User, UserRole
from app.schemas.auth import UserCreate, UserResponse

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory OTP storage (use Redis in production)
otp_storage: dict[str, Tuple[str, datetime]] = {}


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str, token_type: str = "access") -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != token_type:
            return None
        return payload
    except JWTError:
        return None


def generate_otp() -> str:
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))


def store_otp(email: str) -> str:
    """Store OTP for email with expiration"""
    otp = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    otp_storage[email] = (otp, expires_at)
    return otp


def verify_otp(email: str, otp: str) -> bool:
    """Verify OTP for email"""
    if email not in otp_storage:
        return False
    stored_otp, expires_at = otp_storage[email]
    if datetime.utcnow() > expires_at:
        del otp_storage[email]
        return False
    if stored_otp != otp:
        return False
    del otp_storage[email]
    return True


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_data: UserCreate) -> User:
    hashed_password = get_password_hash(user_data.password)
<<<<<<< HEAD
    # Convert SignupRole to UserRole
    role_value = user_data.role.value if hasattr(user_data.role, 'value') else str(user_data.role)
    db_role = UserRole(role_value)
    
=======
>>>>>>> origin/auth_and_login
    db_user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        password_hash=hashed_password,
<<<<<<< HEAD
        role=db_role,
=======
        role=user_data.role,
>>>>>>> origin/auth_and_login
        company_name=user_data.company_name,
        business_category=user_data.business_category,
        gstin=user_data.gstin,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_oauth_user(db: Session, email: str, first_name: str, last_name: str, provider: str) -> User:
    """Create user from OAuth provider"""
    # Generate a random password for OAuth users (they won't use it)
    random_password = secrets.token_urlsafe(32)
    db_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=get_password_hash(random_password),
        role=UserRole.CUSTOMER,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def update_user_password(db: Session, user: User, new_password: str) -> User:
    user.password_hash = get_password_hash(new_password)
    db.commit()
    db.refresh(user)
    return user


# OAuth Helpers
def get_google_oauth_url() -> str:
    """Generate Google OAuth authorization URL"""
    oauth = OAuth2Session(
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        redirect_uri=f"{settings.BACKEND_URL}/api/auth/google/callback"
    )
    authorization_url, state = oauth.create_authorization_url(
        "https://accounts.google.com/o/oauth2/v2/auth",
        scope=["openid", "email", "profile"]
    )
    return authorization_url


def get_github_oauth_url() -> str:
    """Generate GitHub OAuth authorization URL"""
    oauth = OAuth2Session(
        client_id=settings.GITHUB_CLIENT_ID,
        client_secret=settings.GITHUB_CLIENT_SECRET,
        redirect_uri=f"{settings.BACKEND_URL}/api/auth/github/callback"
    )
    authorization_url, state = oauth.create_authorization_url(
        "https://github.com/login/oauth/authorize",
        scope=["user:email"]
    )
    return authorization_url


async def get_google_user_info(code: str) -> dict:
    """Exchange code for token and get user info from Google"""
    oauth = OAuth2Session(
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        redirect_uri=f"{settings.BACKEND_URL}/api/auth/google/callback"
    )
    token = oauth.fetch_token(
        "https://oauth2.googleapis.com/token",
        code=code
    )
    resp = oauth.get("https://www.googleapis.com/oauth2/v3/userinfo")
    return resp.json()


async def get_github_user_info(code: str) -> dict:
    """Exchange code for token and get user info from GitHub"""
    oauth = OAuth2Session(
        client_id=settings.GITHUB_CLIENT_ID,
        client_secret=settings.GITHUB_CLIENT_SECRET,
        redirect_uri=f"{settings.BACKEND_URL}/api/auth/github/callback"
    )
    token = oauth.fetch_token(
        "https://github.com/login/oauth/access_token",
        code=code
    )
    # Get user info
    resp = oauth.get("https://api.github.com/user")
    user_data = resp.json()
    
    # Get primary email if not in user data
    if not user_data.get("email"):
        emails_resp = oauth.get("https://api.github.com/user/emails")
        emails = emails_resp.json()
        primary_email = next((e["email"] for e in emails if e["primary"]), None)
        user_data["email"] = primary_email
    
    return user_data


def user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        role=user.role,
        company_name=user.company_name,
        business_category=user.business_category,
        gstin=user.gstin,
        is_active=user.is_active
    )
