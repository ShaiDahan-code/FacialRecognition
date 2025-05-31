from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

from database.database import get_db
from models.user import User, UserSubscription
from services.auth_service import get_current_user, get_password_hash

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

class UserProfile(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    first_name: Optional[str]
    last_name: Optional[str]
    created_at: datetime
    
    class Config:
        orm_mode = True

class UserProfileUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[EmailStr]
    
class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.put("/me", response_model=UserProfile)
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Update user data
    if profile_data.first_name is not None:
        current_user.first_name = profile_data.first_name
    
    if profile_data.last_name is not None:
        current_user.last_name = profile_data.last_name
    
    if profile_data.email is not None and profile_data.email != current_user.email:
        # Check if email is already taken
        existing_user = db.query(User).filter(User.email == profile_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        current_user.email = profile_data.email
    
    # Update timestamp
    current_user.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.put("/me/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify current password
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    # Update password
    current_user.password_hash = get_password_hash(password_data.new_password)
    current_user.updated_at = datetime.utcnow()
    
    db.commit()
    
    return None

class SubscriptionResponse(BaseModel):
    subscription_id: int
    package_name: str
    is_active: bool
    start_date: datetime
    end_date: datetime
    
    class Config:
        orm_mode = True

@router.get("/me/subscription", response_model=Optional[SubscriptionResponse])
async def get_user_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get active subscription
    subscription = db.query(UserSubscription).filter(
        UserSubscription.user_id == current_user.user_id,
        UserSubscription.is_active == True
    ).first()
    
    if not subscription:
        return None
    
    # Create response
    response = SubscriptionResponse(
        subscription_id=subscription.subscription_id,
        package_name=subscription.package.name,
        is_active=subscription.is_active,
        start_date=subscription.start_date,
        end_date=subscription.end_date
    )
    
    return response