"""
Pluggable AI service — supports Gemini, Claude (Anthropic), OpenAI.

Rule: NEVER hardcode provider, model name, or API key.
Switching AI model = change config only. Zero code changes.

Three AI roles (CONTEXT.md Chapter 9):
  Role 1: Setup Analyst AI   — during onboarding
  Role 2: Conversation Agent — end user chat (widget)
  Role 3: Feature Architect  — new feature design
"""
import logging
from abc import ABC, abstractmethod
from typing import AsyncGenerator, Optional

logger = logging.getLogger(__name__)


class AIService(ABC):
    """Abstract base for all AI providers."""

    @abstractmethod
    async def stream_chat(
        self,
        messages: list[dict[str, str]],
        system_prompt: str,
    ) -> AsyncGenerator[str, None]:
        """Stream AI response chunks."""
        ...

    @abstractmethod
    async def complete(
        self,
        messages: list[dict[str, str]],
        system_prompt: str,
    ) -> str:
        """Non-streaming completion."""
        ...


class GeminiService(AIService):
    """Google Gemini provider."""

    def __init__(self, api_key: str, model: str = "gemini-1.5-flash"):
        self.api_key = api_key
        self.model_name = model
        self._client = None

    def _get_client(self):
        if not self._client:
            from langchain_google_genai import ChatGoogleGenerativeAI
            self._client = ChatGoogleGenerativeAI(
                model=self.model_name,
                google_api_key=self.api_key,
                streaming=True,
            )
        return self._client

    async def stream_chat(
        self, messages: list[dict], system_prompt: str
    ) -> AsyncGenerator[str, None]:
        from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

        lc_messages = [SystemMessage(content=system_prompt)]
        for msg in messages:
            if msg["role"] == "user":
                lc_messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                lc_messages.append(AIMessage(content=msg["content"]))

        client = self._get_client()
        async for chunk in client.astream(lc_messages):
            if chunk.content:
                yield chunk.content

    async def complete(self, messages: list[dict], system_prompt: str) -> str:
        from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

        lc_messages = [SystemMessage(content=system_prompt)]
        for msg in messages:
            if msg["role"] == "user":
                lc_messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                lc_messages.append(AIMessage(content=msg["content"]))

        client = self._get_client()
        response = await client.ainvoke(lc_messages)
        return response.content


class ClaudeService(AIService):
    """Anthropic Claude provider."""

    def __init__(self, api_key: str, model: str = "claude-3-5-sonnet-20241022"):
        self.api_key = api_key
        self.model_name = model

    async def stream_chat(
        self, messages: list[dict], system_prompt: str
    ) -> AsyncGenerator[str, None]:
        try:
            import anthropic
        except ImportError:
            raise RuntimeError("anthropic package not installed. Run: pip install anthropic")

        client = anthropic.AsyncAnthropic(api_key=self.api_key)
        async with client.messages.stream(
            model=self.model_name,
            max_tokens=2048,
            system=system_prompt,
            messages=messages,
        ) as stream:
            async for text in stream.text_stream:
                yield text

    async def complete(self, messages: list[dict], system_prompt: str) -> str:
        try:
            import anthropic
        except ImportError:
            raise RuntimeError("anthropic package not installed.")

        client = anthropic.AsyncAnthropic(api_key=self.api_key)
        response = await client.messages.create(
            model=self.model_name,
            max_tokens=2048,
            system=system_prompt,
            messages=messages,
        )
        return response.content[0].text


class OpenAIService(AIService):
    """OpenAI provider."""

    def __init__(self, api_key: str, model: str = "gpt-4o-mini"):
        self.api_key = api_key
        self.model_name = model

    async def stream_chat(
        self, messages: list[dict], system_prompt: str
    ) -> AsyncGenerator[str, None]:
        try:
            from openai import AsyncOpenAI
        except ImportError:
            raise RuntimeError("openai package not installed. Run: pip install openai")

        client = AsyncOpenAI(api_key=self.api_key)
        all_messages = [{"role": "system", "content": system_prompt}] + messages

        async with await client.chat.completions.create(
            model=self.model_name,
            messages=all_messages,
            stream=True,
        ) as stream:
            async for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield delta

    async def complete(self, messages: list[dict], system_prompt: str) -> str:
        try:
            from openai import AsyncOpenAI
        except ImportError:
            raise RuntimeError("openai package not installed.")

        client = AsyncOpenAI(api_key=self.api_key)
        all_messages = [{"role": "system", "content": system_prompt}] + messages
        response = await client.chat.completions.create(
            model=self.model_name,
            messages=all_messages,
        )
        return response.choices[0].message.content


def get_ai_service(
    provider: Optional[str] = None,
    model: Optional[str] = None,
    api_key: Optional[str] = None,
) -> AIService:
    """
    Factory: returns the correct AIService based on config.

    Falls back to platform defaults from settings if args not provided.
    Zero code changes required to switch providers — only config changes.
    """
    from app.core.config import settings

    active_provider = provider or settings.AI_PRIMARY_PROVIDER
    active_model = model or settings.AI_PRIMARY_MODEL
    active_key = api_key or _get_platform_key(active_provider)

    if active_provider == "google":
        return GeminiService(api_key=active_key, model=active_model)
    if active_provider == "anthropic":
        return ClaudeService(api_key=active_key, model=active_model)
    if active_provider == "openai":
        return OpenAIService(api_key=active_key, model=active_model)

    raise ValueError(f"Unsupported AI provider: {active_provider}")


def get_fallback_ai_service() -> AIService:
    """Returns the fallback AI service (for when primary fails)."""
    from app.core.config import settings
    return get_ai_service(
        provider=settings.AI_FALLBACK_PROVIDER,
        model=settings.AI_FALLBACK_MODEL,
    )


def _get_platform_key(provider: str) -> str:
    """Get platform's API key for the given provider from settings."""
    from app.core.config import settings
    keys = {
        "google": settings.GEMINI_API_KEY,
        "anthropic": settings.ANTHROPIC_API_KEY,
        "openai": settings.OPENAI_API_KEY,
    }
    key = keys.get(provider, "")
    if not key:
        raise ValueError(f"No API key configured for provider '{provider}'")
    return key
