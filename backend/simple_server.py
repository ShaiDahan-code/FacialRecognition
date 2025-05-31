from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
import os
import json
import time

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    first_name: str
    last_name: str

class LoginForm(BaseModel):
    username: str
    password: str

app = FastAPI(
    title="Facial Recognition API",
    description="Simplified backend API for photo sharing platform",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:4200",  # Angular development server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs("uploads", exist_ok=True)

# Mock user database for development
mock_users = []

@app.get("/")
async def root():
    return {"message": "Welcome to the Facial Recognition API"}

@app.get("/health")
async def health_check():
    return {"status": "OK"}

@app.post("/api/auth/token")
async def login_for_access_token(form_data: LoginForm = Body(...)):
    """
    For development, accept any username/password and return a mock token.
    In production, validate credentials against a database.
    """
    print(f"Login attempt: {form_data.username}")
    
    # For development, accept any login
    return {
        "access_token": "mock_token_for_development",
        "token_type": "bearer",
        "user_id": 1,
        "email": form_data.username,
        "username": form_data.username.split('@')[0] if '@' in form_data.username else form_data.username
    }

@app.post("/api/auth/register")
async def register_user(user_data: UserCreate):
    # Add user to mock database
    user_id = len(mock_users) + 1
    mock_users.append({
        "user_id": user_id,
        "username": user_data.username,
        "email": user_data.email,
        "password": user_data.password,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())
    })
    print(f"Registered user: {user_data.username}. Total users: {len(mock_users)}")
    
    return {
        "message": "User registered successfully",
        "user_id": user_id
    }

@app.get("/api/users/me")
async def get_user_profile():
    # Mock user profile - in a real app, this would be the current authenticated user
    if len(mock_users) > 0:
        # Return the first registered user
        return mock_users[0]
    else:
        # Return a default user if none registered
        return {
            "user_id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "created_at": "2023-01-01T00:00:00"
        }

@app.post("/api/photos/upload")
async def upload_photo(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Create a timestamp-based filename to avoid collisions
    timestamp = int(time.time())
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join("uploads", filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Mock photo record
    return {
        "photo_id": timestamp,
        "file_name": filename,
        "storage_path": file_path,
        "is_processed": False,
        "upload_date": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())
    }

@app.get("/api/photos")
async def get_photos():
    # Mock photo list
    photos = []
    
    # List files in uploads directory
    if os.path.exists("uploads"):
        for filename in os.listdir("uploads"):
            if os.path.isfile(os.path.join("uploads", filename)):
                photo_id = int(filename.split("_")[0]) if "_" in filename else int(time.time())
                photos.append({
                    "photo_id": photo_id,
                    "file_name": filename,
                    "storage_path": os.path.join("uploads", filename),
                    "is_processed": True,
                    "upload_date": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime(photo_id))
                })
    
    return photos

if __name__ == "__main__":
    uvicorn.run("simple_server:app", host="0.0.0.0", port=8000, reload=True)