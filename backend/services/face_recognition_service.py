import os
import numpy as np
import pickle
from typing import List, Tuple
import cv2
import logging
from fastapi import UploadFile, HTTPException
from PIL import Image
import io
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FaceRecognitionService:
    def __init__(self):
        # Load the pre-trained face detection model from OpenCV
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        
        self.face_recognizer = cv2.face.LBPHFaceRecognizer_create()
        self.distance_metric = "euclidean"
        self.similarity_threshold = 0.6
        
        # Ensure models directory exists
        models_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models")
        os.makedirs(models_path, exist_ok=True)
        
        logger.info(f"OpenCV Face recognition service initialized")

    async def detect_faces(self, image_path: str) -> List[dict]:
        """
        Detect faces in an image and return face locations and features.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            List of dictionaries containing face location and features
        """
        try:
            # Measure processing time
            start_time = time.time()
            
            logger.info(f"Detecting faces in image: {image_path}")
            
            # Read the image using OpenCV
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Failed to read image at {image_path}")
            
            # Convert to grayscale for face detection
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Detect faces
            faces = self.face_cascade.detectMultiScale(
                gray, 
                scaleFactor=1.1, 
                minNeighbors=5, 
                minSize=(30, 30)
            )
            
            if len(faces) == 0:
                logger.info(f"No faces detected in image: {image_path}")
                return []
            
            results = []
            
            for (x, y, w, h) in faces:
                # Extract face ROI
                face_roi = gray[y:y+h, x:x+w]
                
                # Use the face region as a simple feature vector
                # In a real app, we'd use a proper face embedding here
                face_resized = cv2.resize(face_roi, (100, 100))
                face_flattened = face_resized.flatten() / 255.0  # Normalize
                
                # Store results
                results.append({
                    "location": {
                        "x": float(x),
                        "y": float(y),
                        "width": float(w),
                        "height": float(h)
                    },
                    "embedding": face_flattened,
                    "confidence": 1.0
                })
            
            processing_time = time.time() - start_time
            logger.info(f"Detected {len(results)} faces in {processing_time:.2f} seconds")
            
            return results
            
        except Exception as e:
            logger.error(f"Error detecting faces: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Face detection failed: {str(e)}")
    
    async def compare_faces(self, source_embedding: np.ndarray, target_embeddings: List[np.ndarray]) -> List[Tuple[float, int]]:
        """
        Compare a face embedding with a list of face embeddings.
        
        Args:
            source_embedding: The source face embedding
            target_embeddings: List of target face embeddings to compare against
            
        Returns:
            List of tuples containing (similarity_score, target_index)
        """
        results = []
        
        for i, target_embedding in enumerate(target_embeddings):
            # Calculate Euclidean distance
            distance = np.linalg.norm(source_embedding - target_embedding)
            # Convert distance to similarity score (1 - normalized distance)
            similarity = 1.0 - min(distance / 100.0, 1.0)  # Larger normalization for pixel-based features
            results.append((similarity, i))
        
        # Sort by similarity (higher is better)
        results.sort(reverse=True)
        
        return results
    
    def _cosine_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """
        Calculate cosine similarity between two embeddings.
        
        Args:
            embedding1: First embedding
            embedding2: Second embedding
            
        Returns:
            Cosine similarity (higher means more similar)
        """
        dot = np.dot(embedding1, embedding2)
        norm1 = np.linalg.norm(embedding1)
        norm2 = np.linalg.norm(embedding2)
        return dot / (norm1 * norm2)
    
    async def process_uploaded_image(self, file: UploadFile) -> str:
        """
        Process an uploaded image and save it to disk.
        
        Args:
            file: FastAPI UploadFile object
            
        Returns:
            Path to the saved image
        """
        try:
            # Create uploads directory if it doesn't exist
            upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")
            os.makedirs(upload_dir, exist_ok=True)
            
            # Generate a safe filename
            timestamp = int(time.time())
            safe_filename = f"{timestamp}_{file.filename}"
            file_path = os.path.join(upload_dir, safe_filename)
            
            # Read file content
            contents = await file.read()
            
            # Check if it's a valid image
            try:
                # Try to open with PIL to verify it's a valid image
                image = Image.open(io.BytesIO(contents))
                image.verify()  # Verify it's an image
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid image file")
            
            # Save the image
            with open(file_path, "wb") as f:
                f.write(contents)
                
            logger.info(f"Saved uploaded image to {file_path}")
            
            return file_path
            
        except Exception as e:
            logger.error(f"Error processing uploaded image: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")
    
    def serialize_embedding(self, embedding: np.ndarray) -> bytes:
        """Serialize a numpy embedding to bytes for storage"""
        return pickle.dumps(embedding)
    
    def deserialize_embedding(self, data: bytes) -> np.ndarray:
        """Deserialize bytes to a numpy embedding"""
        return pickle.loads(data)