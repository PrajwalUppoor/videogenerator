from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.api import transcription, video

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcription.router, prefix=f"{settings.API_V1_STR}/ai", tags=["ai"])
app.include_router(video.router, prefix=f"{settings.API_V1_STR}/video", tags=["video"])

@app.get("/")
def root():
    return {"message": "Welcome to Remotion SaaS API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# TODO: Include routers for auth, projects, videos, renders
