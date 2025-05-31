from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database.database import Base

class Event(Base):
    __tablename__ = "events"
    
    event_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    description = Column(String)
    event_date = Column(DateTime(timezone=True))
    location = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="events")
    photos = relationship("Photo", back_populates="event")

class Photo(Base):
    __tablename__ = "photos"
    
    photo_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    event_id = Column(Integer, ForeignKey("events.event_id", ondelete="SET NULL"), nullable=True)
    file_name = Column(String(255), nullable=False)
    storage_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)  # in bytes
    width = Column(Integer)
    height = Column(Integer)
    format = Column(String(10))
    taken_at = Column(DateTime(timezone=True))
    location_lat = Column(Float(precision=8), nullable=True)
    location_long = Column(Float(precision=8), nullable=True)
    camera_model = Column(String(100))
    is_processed = Column(Boolean, default=False)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    is_deleted = Column(Boolean, default=False)
    
    # Relationships
    owner = relationship("User", back_populates="photos")
    event = relationship("Event", back_populates="photos")
    face_detections = relationship("FaceDetection", back_populates="photo")
    
class Tag(Base):
    __tablename__ = "tags"
    
    tag_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    is_global = Column(Boolean, default=False)
    
class PhotoTag(Base):
    __tablename__ = "photo_tags"
    
    photo_id = Column(Integer, ForeignKey("photos.photo_id", ondelete="CASCADE"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.tag_id", ondelete="CASCADE"), primary_key=True)