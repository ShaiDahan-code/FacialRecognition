from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database.database import Base

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(50))
    last_name = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    
    # Relationships
    photos = relationship("Photo", back_populates="owner")
    events = relationship("Event", back_populates="owner")
    subscriptions = relationship("UserSubscription", back_populates="user")
    faces = relationship("Face", back_populates="owner")
    
class SubscriptionPackage(Base):
    __tablename__ = "subscription_packages"
    
    package_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    description = Column(String)
    price = Column(Integer, nullable=False)  # Price in cents
    storage_limit_gb = Column(Integer)
    max_photos = Column(Integer)
    max_faces = Column(Integer)
    max_events = Column(Integer)
    feature_facial_recognition = Column(Boolean, default=True)
    feature_sharing = Column(Boolean, default=True)
    duration_days = Column(Integer, nullable=False)
    
    # Relationships
    subscriptions = relationship("UserSubscription", back_populates="package")
    
class UserSubscription(Base):
    __tablename__ = "user_subscriptions"
    
    subscription_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    package_id = Column(Integer, ForeignKey("subscription_packages.package_id"))
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    is_active = Column(Boolean, default=True)
    auto_renew = Column(Boolean, default=False)
    payment_status = Column(String(20))
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")
    package = relationship("SubscriptionPackage", back_populates="subscriptions")