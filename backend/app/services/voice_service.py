"""
Voice service — STT and TTS with stubbed implementations.

Architecture (CONTEXT.md §4.2):
  Mic → Widget → WebSocket → STT → AI → TTS → Widget → Speaker

Primary STT : Deepgram (real-time streaming)
Fallback STT : OpenAI Whisper
Primary TTS : ElevenLabs
Fallback TTS : Google Cloud TTS

NOTE: Voice providers are STUBBED in this version.
Wire up real implementations by injecting real API keys in .env
and replacing the stub methods below.

Latency target: < 1.5 seconds end-to-end.
Failure mode: auto-switch to text chat (silent, no error to user).
"""
import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


# ── STT (Speech-to-Text) ────────────────────────────────────────────────────

class STTService(ABC):
    @abstractmethod
    async def transcribe(self, audio_bytes: bytes, language: str = "en-US") -> str:
        ...


class DeepgramSTT(STTService):
    """Primary STT — Deepgram real-time streaming."""

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def transcribe(self, audio_bytes: bytes, language: str = "en-US") -> str:
        if not self.api_key:
            logger.warning("Deepgram API key not set — using stub STT")
            return "[Deepgram STT stub — configure DEEPGRAM_API_KEY]"

        # TODO: Implement real Deepgram streaming transcription
        # from deepgram import DeepgramClient, PrerecordedOptions
        # client = DeepgramClient(self.api_key)
        # options = PrerecordedOptions(model="nova-2", language=language)
        # response = await client.listen.asyncprerecorded.v("1").transcribe_file(
        #     {"buffer": audio_bytes}, options
        # )
        # return response["results"]["channels"][0]["alternatives"][0]["transcript"]
        logger.warning("Deepgram real transcription not yet implemented.")
        return "[stub transcription]"


class WhisperSTT(STTService):
    """Fallback STT — OpenAI Whisper."""

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def transcribe(self, audio_bytes: bytes, language: str = "en-US") -> str:
        if not self.api_key:
            return "[Whisper STT stub — configure OPENAI_API_KEY]"

        # TODO: Implement real Whisper transcription
        logger.warning("Whisper real transcription not yet implemented.")
        return "[stub transcription]"


# ── TTS (Text-to-Speech) ─────────────────────────────────────────────────────

class TTSService(ABC):
    @abstractmethod
    async def synthesize(self, text: str, language: str = "en-US") -> bytes:
        ...


class ElevenLabsTTS(TTSService):
    """Primary TTS — ElevenLabs natural voice."""

    def __init__(self, api_key: str, voice_id: str = "21m00Tcm4TlvDq8ikWAM"):
        self.api_key = api_key
        self.voice_id = voice_id

    async def synthesize(self, text: str, language: str = "en-US") -> bytes:
        if not self.api_key:
            logger.warning("ElevenLabs API key not set — using stub TTS")
            return b""

        # TODO: Implement real ElevenLabs TTS
        # from elevenlabs import AsyncElevenLabs
        # client = AsyncElevenLabs(api_key=self.api_key)
        # audio = await client.generate(text=text, voice=self.voice_id)
        # return audio
        logger.warning("ElevenLabs real synthesis not yet implemented.")
        return b""


class GoogleCloudTTS(TTSService):
    """Fallback TTS — Google Cloud Text-to-Speech."""

    async def synthesize(self, text: str, language: str = "en-US") -> bytes:
        # TODO: Implement Google Cloud TTS
        logger.warning("Google Cloud TTS not yet implemented.")
        return b""


# ── Factory functions ─────────────────────────────────────────────────────────

def get_stt_service(primary: bool = True) -> STTService:
    """Get the appropriate STT service."""
    from app.core.config import settings
    if primary:
        return DeepgramSTT(api_key=settings.DEEPGRAM_API_KEY)
    return WhisperSTT(api_key=settings.OPENAI_API_KEY)


def get_tts_service(primary: bool = True) -> TTSService:
    """Get the appropriate TTS service."""
    from app.core.config import settings
    if primary:
        return ElevenLabsTTS(api_key=settings.ELEVENLABS_API_KEY)
    return GoogleCloudTTS()
