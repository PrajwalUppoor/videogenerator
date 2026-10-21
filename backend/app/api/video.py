from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import generate_video_schema
from typing import Dict, Any

router = APIRouter()

class VideoPrompt(BaseModel):
    prompt: str

@router.post("/generate")
async def generate_video(prompt_data: VideoPrompt):
    """
    Generate a video schema from a text prompt.
    """
    if not prompt_data.prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    try:
        # For now, this uses the mock implementation in ai_service.py
        # You can later integrate OpenAI or other LLMs here
        schema = generate_video_schema(prompt_data.prompt)
        return schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
