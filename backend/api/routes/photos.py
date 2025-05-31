from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import os
import shutil
from datetime import datetime

from database.database import get_db
from models.user import User
from models.photo import Photo, Event
from services.auth_service import get_current_user
from services.face_recognition_service import FaceRecognitionService

router = APIRouter(
    prefix="/photos",
    tags=["photos"]
)

# Initialize face recognition service
face_recognition_service = FaceRecognitionService()

class PhotoCreate(BaseModel):
    event_id: Optional[int] = None
    taken_at: Optional[datetime] = None
    location_lat: Optional[float] = None
    location_long: Optional[float] = None
    camera_model: Optional[str] = None

class PhotoResponse(BaseModel):
    photo_id: int
    file_name: str
    storage_path: str
    width: Optional[int]
    height: Optional[int]
    format: Optional[str]
    taken_at: Optional[datetime]
    is_processed: bool
    upload_date: datetime

    class Config:
        orm_mode = True

@router.post("/upload", response_model=PhotoResponse)
async def upload_photo(
    event_id: Optional[int] = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Process and save the uploaded image
    file_path = await face_recognition_service.process_uploaded_image(file)
    
    # Get file information
    file_size = os.path.getsize(file_path)
    file_name = os.path.basename(file_path)
    
    # Check if event exists if event_id is provided
    if event_id:
        event = db.query(Event).filter(
            Event.event_id == event_id,
            Event.user_id == current_user.user_id
        ).first()
        
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found or you don't have access"
            )
    
    # Create photo record
    new_photo = Photo(
        user_id=current_user.user_id,
        event_id=event_id,
        file_name=file_name,
        storage_path=file_path,
        file_size=file_size,
        is_processed=False
    )
    
    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)
    
    # Return response
    return new_photo

@router.get("/{photo_id}", response_model=PhotoResponse)
async def get_photo(
    photo_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get photo by ID
    photo = db.query(Photo).filter(
        Photo.photo_id == photo_id,
        Photo.user_id == current_user.user_id
    ).first()
    
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found or you don't have access"
        )
    
    return photo

@router.get("/{photo_id}/file")
async def get_photo_file(
    photo_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get photo by ID
    photo = db.query(Photo).filter(
        Photo.photo_id == photo_id,
        Photo.user_id == current_user.user_id
    ).first()
    
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found or you don't have access"
        )
    
    # Return file
    return FileResponse(photo.storage_path, filename=photo.file_name)

@router.get("/", response_model=List[PhotoResponse])
async def get_photos(
    event_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Build query
    query = db.query(Photo).filter(
        Photo.user_id == current_user.user_id,
        Photo.is_deleted == False
    )
    
    # Filter by event if specified
    if event_id:
        query = query.filter(Photo.event_id == event_id)
    
    # Get photos with pagination
    photos = query.order_by(Photo.upload_date.desc()).offset(skip).limit(limit).all()
    
    return photos

@router.delete("/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_photo(
    photo_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get photo by ID
    photo = db.query(Photo).filter(
        Photo.photo_id == photo_id,
        Photo.user_id == current_user.user_id
    ).first()
    
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found or you don't have access"
        )
    
    # Soft delete (mark as deleted)
    photo.is_deleted = True
    db.commit()
    
    return None