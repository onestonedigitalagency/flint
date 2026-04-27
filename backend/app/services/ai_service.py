import os
import json
from abc import ABC, abstractmethod
from typing import AsyncGenerator, List, Dict
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, BaseMessage

class AIService(ABC):
    @abstractmethod
    async def stream_chat(self, messages: List[Dict[str, str]], context: str) -> AsyncGenerator[str, None]:
        pass

class GeminiService(AIService):
    def __init__(self, api_key: str):
        self.api_key = api_key
        # Configure Gemini
        genai.configure(api_key=api_key)
        self.model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key, streaming=True)

    async def stream_chat(self, messages: List[Dict[str, str]], context: str) -> AsyncGenerator[str, None]:
        langchain_messages: List[BaseMessage] = [SystemMessage(content=f"You are a helpful assistant for a business. Use this context to answer queries accurately: {context}")]
        
        for msg in messages:
            if msg['role'] == 'user':
                langchain_messages.append(HumanMessage(content=msg['content']))
            elif msg['role'] == 'assistant':
                langchain_messages.append(SystemMessage(content=msg['content'])) # Using System for assistant as simplified mapping

        async for chunk in self.model.astream(langchain_messages):
            yield chunk.content

def get_ai_service(model_name: str, api_key: str) -> AIService:
    if model_name.lower() == "gemini":
        return GeminiService(api_key)
    # Add OpenAI/Claude here later
    raise ValueError(f"Unsupported model: {model_name}")
