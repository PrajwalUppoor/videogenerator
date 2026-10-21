from typing import Dict, Any
import json

def generate_video_schema(prompt: str) -> Dict[str, Any]:
    # In a real app, this would call OpenAI/Anthropic/OpenRouter
    # For now, we'll simulate a punchy script generator
    
    # Simulate AI output
    return {
        "title": f"Video about {prompt}",
        "scenes": [
            {
                "type": "text",
                "text": f"Ever wondered about {prompt}?",
                "duration": 3.0
            },
            {
                "type": "text",
                "text": "It's changing everything we know.",
                "duration": 3.0
            },
            {
                "type": "image-text",
                "text": "Join the revolution today!",
                "imageUrl": "https://picsum.photos/1080/1920",
                "duration": 4.0
            }
        ],
        "theme": {
            "background": "#1e1b4b",
            "textColor": "#ffffff",
            "fontFamily": "Inter"
        }
    }
