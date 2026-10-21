from sqlalchemy.orm import Session
from app.models.models import Video, RenderJob
from app.schemas.video import VideoCreate
import uuid

def create_video(db: Session, video_data: VideoCreate, organization_id: uuid.UUID):
    db_video = Video(
        project_id=video_data.project_id,
        template_version_id=video_data.template_version_id,
        input_data=video_data.input_data,
        title=video_data.title,
        status="draft"
    )
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

def create_render_job(db: Session, video_id: uuid.UUID):
    db_job = RenderJob(
        video_id=video_id,
        status="queued"
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    # TODO: Trigger background task (Celery/Lambda)
    return db_job
