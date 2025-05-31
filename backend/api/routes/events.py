from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from database.database import get_db
from models.user import User
from models.photo import Event, Photo
from services.auth_service import get_current_user

router = APIRouter(
    prefix="/events",
    tags=["events"]
)

class EventCreate(BaseModel):
    name: str
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = None

class EventResponse(BaseModel):
    event_id: int
    name: str
    description: Optional[str]
    event_date: Optional[datetime]
    location: Optional[str]
    created_at: datetime
    photo_count: int
    
    class Config:
        orm_mode = True

class EventUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    event_date: Optional[datetime]
    location: Optional[str]

@router.post("/", response_model=EventResponse)
async def create_event(
    event_data: EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create new event
    new_event = Event(
        user_id=current_user.user_id,
        name=event_data.name,
        description=event_data.description,
        event_date=event_data.event_date,
        location=event_data.location
    )
    
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    
    # Get photo count (should be 0 for new event)
    photo_count = db.query(Photo).filter(
        Photo.event_id == new_event.event_id,
        Photo.is_deleted == False
    ).count()
    
    # Create response
    response = EventResponse(
        event_id=new_event.event_id,
        name=new_event.name,
        description=new_event.description,
        event_date=new_event.event_date,
        location=new_event.location,
        created_at=new_event.created_at,
        photo_count=photo_count
    )
    
    return response

@router.get("/", response_model=List[EventResponse])
async def get_events(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get events for user
    events = db.query(Event).filter(
        Event.user_id == current_user.user_id
    ).order_by(Event.created_at.desc()).offset(skip).limit(limit).all()
    
    # Get photo count for each event
    responses = []
    for event in events:
        photo_count = db.query(Photo).filter(
            Photo.event_id == event.event_id,
            Photo.is_deleted == False
        ).count()
        
        responses.append(
            EventResponse(
                event_id=event.event_id,
                name=event.name,
                description=event.description,
                event_date=event.event_date,
                location=event.location,
                created_at=event.created_at,
                photo_count=photo_count
            )
        )
    
    return responses

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get event by ID
    event = db.query(Event).filter(
        Event.event_id == event_id,
        Event.user_id == current_user.user_id
    ).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found or you don't have access"
        )
    
    # Get photo count for event
    photo_count = db.query(Photo).filter(
        Photo.event_id == event.event_id,
        Photo.is_deleted == False
    ).count()
    
    # Create response
    response = EventResponse(
        event_id=event.event_id,
        name=event.name,
        description=event.description,
        event_date=event.event_date,
        location=event.location,
        created_at=event.created_at,
        photo_count=photo_count
    )
    
    return response

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    event_data: EventUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get event by ID
    event = db.query(Event).filter(
        Event.event_id == event_id,
        Event.user_id == current_user.user_id
    ).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found or you don't have access"
        )
    
    # Update event data
    if event_data.name is not None:
        event.name = event_data.name
    
    if event_data.description is not None:
        event.description = event_data.description
    
    if event_data.event_date is not None:
        event.event_date = event_data.event_date
    
    if event_data.location is not None:
        event.location = event_data.location
    
    # Update timestamp
    event.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(event)
    
    # Get photo count for event
    photo_count = db.query(Photo).filter(
        Photo.event_id == event.event_id,
        Photo.is_deleted == False
    ).count()
    
    # Create response
    response = EventResponse(
        event_id=event.event_id,
        name=event.name,
        description=event.description,
        event_date=event.event_date,
        location=event.location,
        created_at=event.created_at,
        photo_count=photo_count
    )
    
    return response

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get event by ID
    event = db.query(Event).filter(
        Event.event_id == event_id,
        Event.user_id == current_user.user_id
    ).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found or you don't have access"
        )
    
    # Delete event (cascade will handle photos)
    db.delete(event)
    db.commit()
    
    return None