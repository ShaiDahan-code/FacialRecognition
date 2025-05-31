from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import numpy as np
import os
import logging

from database.database import get_db
from models.user import User
from models.photo import Photo
from models.face import Face, FaceDetection
from services.auth_service import get_current_user
from services.face_recognition_service import FaceRecognitionService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/faces",
    tags=["faces"]
)

# Initialize face recognition service
face_recognition_service = FaceRecognitionService()

class FaceDetectionResponse(BaseModel):
    detection_id: int
    photo_id: int
    face_id: Optional[int]
    bounding_box_x: float
    bounding_box_y: float
    bounding_box_width: float
    bounding_box_height: float
    confidence_score: float
    identified: bool
    
    class Config:
        orm_mode = True

class FaceResponse(BaseModel):
    face_id: int
    person_name: Optional[str]
    
    class Config:
        orm_mode = True

class FaceUpdate(BaseModel):
    person_name: str

async def process_photo_faces(
    photo_id: int,
    db: Session,
    user_id: int
):
    """
    Background task to process faces in a photo
    """
    try:
        # Get photo
        photo = db.query(Photo).filter(
            Photo.photo_id == photo_id,
            Photo.user_id == user_id
        ).first()
        
        if not photo or not os.path.exists(photo.storage_path):
            logger.error(f"Photo {photo_id} not found or file doesn't exist")
            return
        
        # Detect faces
        face_detections = await face_recognition_service.detect_faces(photo.storage_path)
        
        if not face_detections:
            # Mark photo as processed even if no faces detected
            photo.is_processed = True
            db.commit()
            logger.info(f"No faces detected in photo {photo_id}")
            return
        
        # Process each detected face
        for detection in face_detections:
            # Save face detection
            face_detection = FaceDetection(
                photo_id=photo.photo_id,
                bounding_box_x=detection["location"]["x"],
                bounding_box_y=detection["location"]["y"],
                bounding_box_width=detection["location"]["width"],
                bounding_box_height=detection["location"]["height"],
                confidence_score=detection["confidence"],
                embedding=face_recognition_service.serialize_embedding(detection["embedding"])
            )
            
            db.add(face_detection)
            db.commit()
            db.refresh(face_detection)
            
            # Try to match with existing faces
            try:
                # Get all existing faces for this user
                existing_faces = db.query(Face).filter(
                    Face.user_id == user_id,
                    Face.is_active == True
                ).all()
                
                if existing_faces:
                    # Get embeddings for comparison
                    existing_embeddings = []
                    for face in existing_faces:
                        embedding = face_recognition_service.deserialize_embedding(face.face_embedding)
                        existing_embeddings.append(embedding)
                    
                    # Compare with existing faces
                    comparisons = await face_recognition_service.compare_faces(
                        detection["embedding"], 
                        existing_embeddings
                    )
                    
                    # Find best match if any
                    if comparisons and comparisons[0][0] >= 0.7:  # Similarity threshold
                        best_match_idx = comparisons[0][1]
                        matched_face = existing_faces[best_match_idx]
                        
                        # Update face detection with matched face
                        face_detection.face_id = matched_face.face_id
                        face_detection.identified = True
                        db.commit()
            except Exception as e:
                logger.error(f"Error matching faces: {str(e)}")
        
        # Mark photo as processed
        photo.is_processed = True
        db.commit()
        logger.info(f"Successfully processed {len(face_detections)} faces in photo {photo_id}")
        
    except Exception as e:
        logger.error(f"Error processing photo {photo_id}: {str(e)}")

@router.post("/process/{photo_id}", status_code=status.HTTP_202_ACCEPTED)
async def process_photo(
    photo_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if photo exists and belongs to user
    photo = db.query(Photo).filter(
        Photo.photo_id == photo_id,
        Photo.user_id == current_user.user_id
    ).first()
    
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found or you don't have access"
        )
    
    # Check if photo is already processed
    if photo.is_processed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Photo is already processed"
        )
    
    # Add task to process photo faces in background
    background_tasks.add_task(
        process_photo_faces, 
        photo_id=photo.photo_id,
        db=db,
        user_id=current_user.user_id
    )
    
    return {"message": "Processing started"}

@router.get("/photo/{photo_id}", response_model=List[FaceDetectionResponse])
async def get_photo_faces(
    photo_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if photo exists and belongs to user
    photo = db.query(Photo).filter(
        Photo.photo_id == photo_id,
        Photo.user_id == current_user.user_id
    ).first()
    
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found or you don't have access"
        )
    
    # Get face detections for photo
    detections = db.query(FaceDetection).filter(
        FaceDetection.photo_id == photo_id
    ).all()
    
    return detections

@router.post("/create", response_model=FaceResponse)
async def create_face(
    detection_id: int,
    face_data: FaceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get face detection
    detection = db.query(FaceDetection).join(Photo).filter(
        FaceDetection.detection_id == detection_id,
        Photo.user_id == current_user.user_id
    ).first()
    
    if not detection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Face detection not found or you don't have access"
        )
    
    # Create new face
    new_face = Face(
        user_id=current_user.user_id,
        person_name=face_data.person_name,
        face_embedding=detection.embedding
    )
    
    db.add(new_face)
    db.commit()
    db.refresh(new_face)
    
    # Update detection with face ID
    detection.face_id = new_face.face_id
    detection.identified = True
    db.commit()
    
    return new_face

@router.put("/update/{face_id}", response_model=FaceResponse)
async def update_face(
    face_id: int,
    face_data: FaceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get face
    face = db.query(Face).filter(
        Face.face_id == face_id,
        Face.user_id == current_user.user_id
    ).first()
    
    if not face:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Face not found or you don't have access"
        )
    
    # Update face
    face.person_name = face_data.person_name
    db.commit()
    db.refresh(face)
    
    return face

@router.get("/people", response_model=List[FaceResponse])
async def get_people(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get all faces (people) for user
    faces = db.query(Face).filter(
        Face.user_id == current_user.user_id
    ).all()
    
    return faces

@router.get("/people/{face_id}/photos", response_model=List[int])
async def get_person_photos(
    face_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if face exists and belongs to user
    face = db.query(Face).filter(
        Face.face_id == face_id,
        Face.user_id == current_user.user_id
    ).first()
    
    if not face:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Face not found or you don't have access"
        )
    
    # Get all photos containing this face
    detections = db.query(FaceDetection).filter(
        FaceDetection.face_id == face_id
    ).all()
    
    # Extract photo IDs
    photo_ids = [detection.photo_id for detection in detections]
    
    return photo_ids