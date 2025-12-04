from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from models.schemas import (
    ProcessVideoRequest, 
    ProcessVideoResponse,
    ChatRequest,
    ChatResponse
)
from services.transcript_service import TranscriptService
from services.rag_service import RAGService

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="YouTube Chat API")

# CORS middleware (allow Chrome extension to access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your extension ID
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
transcript_service = TranscriptService()
rag_service = RAGService()

@app.get("/")
def read_root():
    return {"message": "YouTube Chat API is running"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/process-video", response_model=ProcessVideoResponse)
async def process_video(request: ProcessVideoRequest):
    """
    Extract transcript and create embeddings for a YouTube video
    """
    try:
        video_id = request.video_id
        
        # Fetch transcript
        transcript = transcript_service.fetch_transcript(video_id)
        
        if not transcript:
            raise HTTPException(status_code=400, detail="No transcript found")
        
        # Process with RAG
        total_chunks = rag_service.process_transcript(video_id, transcript)
        
        return ProcessVideoResponse(
            success=True,
            message="Video processed successfully",
            video_id=video_id,
            total_chunks=total_chunks
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Answer questions about a processed video
    """
    try:
        video_id = request.video_id
        question = request.question
        
        # Get answer from RAG
        answer = rag_service.answer_question(video_id, question)
        
        return ChatResponse(
            success=True,
            answer=answer,
            video_id=video_id
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)