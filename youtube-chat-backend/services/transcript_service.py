from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled

class TranscriptService:
    @staticmethod
    def fetch_transcript(video_id: str) -> str:
        """
        Fetch transcript from YouTube video
        Returns concatenated transcript text
        """
        try:
            api = YouTubeTranscriptApi()
            transcript_list = api.fetch(video_id, languages=["en"])
            # Use dot notation instead of dictionary access
            transcript = " ".join(chunk.text for chunk in transcript_list)
            return transcript
        
        except TranscriptsDisabled:
            raise Exception("No captions available for this video")
        
        except Exception as e:
            raise Exception(f"Error fetching transcript: {str(e)}")