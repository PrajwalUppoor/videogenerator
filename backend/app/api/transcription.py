from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.transcription_service import transcription_service
from typing import List, Dict, Any

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Endpoint to transcribe an uploaded audio file and return suggested scenes.
    """
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")

    try:
        content = await file.read()
        # 1. Transcribe audio to segments
        segments = await transcription_service.transcribe_audio(content, file.filename)
        
        # 2. Process segments into video scenes
        scenes = transcription_service.segments_to_scenes(segments)
        
        return {
            "filename": file.filename,
            "scenes": scenes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
