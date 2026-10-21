from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import UUID

class VideoBase(BaseModel):
    title: str
    input_data: Dict[str, Any]

class VideoCreate(VideoBase):
    project_id: Optional[UUID] = None
    template_version_id: Optional[UUID] = None

class VideoResponse(VideoBase):
    id: UUID
    status: str

    class Config:
        from_attributes = True
