from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database.database import Base

class Face(Base):
    __tablename__ = "faces"
    
    face_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    person_name = Column(String(100))
    face_embedding = Column(LargeBinary, nullable=False)  # Serialized facial embedding vector
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    confidence_threshold = Column(Float, default=0.9)
    
    # Relationships
    owner = relationship("User", back_populates="faces")
    detections = relationship("FaceDetection", back_populates="face")

class FaceDetection(Base):
    __tablename__ = "face_detections"
    
    detection_id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.photo_id", ondelete="CASCADE"))
    face_id = Column(Integer, ForeignKey("faces.face_id", ondelete="SET NULL"), nullable=True)
    bounding_box_x = Column(Float)
    bounding_box_y = Column(Float)
    bounding_box_width = Column(Float)
    bounding_box_height = Column(Float)
    confidence_score = Column(Float)
    embedding = Column(LargeBinary, nullable=False)  # Serialized facial embedding
    identified = Column(Boolean, default=False)
    
    # Relationships
    photo = relationship("Photo", back_populates="face_detections")
    face = relationship("Face", back_populates="detections")

class SharingPermission(Base):
    __tablename__ = "sharing_permissions"
    
    permission_id = Column(Integer, primary_key=True, index=True)
    resource_type = Column(String(20), nullable=False)  # 'photo', 'event', etc.
    resource_id = Column(Integer, nullable=False)
    granted_to_user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    granted_by_user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    permission_level = Column(String(20), nullable=False)  # 'view', 'download', 'edit', 'share'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)

class PublicSharingLink(Base):
    __tablename__ = "public_sharing_links"
    
    link_id = Column(Integer, primary_key=True, index=True)
    resource_type = Column(String(20), nullable=False)  # 'photo', 'event', etc.
    resource_id = Column(Integer, nullable=False)
    created_by_user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    access_token = Column(String(100), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    is_password_protected = Column(Boolean, default=False)
    password_hash = Column(String(255))
    download_allowed = Column(Boolean, default=False)
    max_views = Column(Integer)
    view_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)