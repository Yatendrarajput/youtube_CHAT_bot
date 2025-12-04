from pydantic import BaseModel

class ProcessVideoRequest(BaseModel):
    video_id: str

class ProcessVideoResponse(BaseModel):
    success: bool
    message: str
    video_id: str
    total_chunks: int

class ChatRequest(BaseModel):
    video_id: str
    question: str

class ChatResponse(BaseModel):
    success: bool
    answer: str
    video_id: str