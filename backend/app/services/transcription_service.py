import whisper
import os
from tempfile import NamedTemporaryFile
from typing import List, Dict, Any
import torch

class TranscriptionService:
    def __init__(self, model_size: str = "base"):
        self.model_size = model_size
        self._model = None
        # Check for GPU
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

    @property
    def model(self):
        """Lazy load the Whisper model"""
        if self._model is None:
            print(f"Loading Whisper model '{self.model_size}' on {self.device}...")
            self._model = whisper.load_model(self.model_size, device=self.device)
        return self._model

    async def transcribe_audio(self, audio_data: bytes, filename: str) -> List[Dict[str, Any]]:
        """
        Transcribes audio locally using the open-source Whisper model.
        """
        # Create a temporary file to hold the audio data
        with NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as temp_audio:
            temp_audio.write(audio_data)
            temp_audio_path = temp_audio.name

        try:
            # Transcribe the audio file
            # verbose=False because we don't want to clutter logs
            result = self.model.transcribe(temp_audio_path, verbose=False)
            
            segments = result.get("segments", [])
            formatted_segments = []
            
            for seg in segments:
                formatted_segments.append({
                    "text": seg["text"].strip(),
                    "start": seg["start"],
                    "end": seg["end"]
                })
            
            return formatted_segments

        except Exception as e:
            print(f"Local transcription error: {str(e)}")
            raise e
        finally:
            if os.path.exists(temp_audio_path):
                os.remove(temp_audio_path)

    def segments_to_scenes(self, segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Converts transcript segments into Remotion-ready scenes.
        Combines small segments for better readability in video.
        """
        scenes = []
        current_text = []
        current_start = 0
        
        for i, seg in enumerate(segments):
            if not current_text:
                current_start = seg["start"]
            
            current_text.append(seg["text"])
            duration = seg["end"] - current_start
            
            # If current group is long enough (2-4 seconds) or it's the last segment
            if duration >= 2.5 or i == len(segments) - 1:
                scenes.append({
                    "type": "text",
                    "text": " ".join(current_text),
                    "duration": round(duration, 2),
                    "lyrics": " ".join(current_text)
                })
                current_text = []
        
        return scenes

# Initialize with the base model for a good balance of speed and accuracy
transcription_service = TranscriptionService(model_size="base")
