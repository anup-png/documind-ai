from abc import ABC, abstractmethod


class ChatModel(ABC):
    @abstractmethod
    def generate(self, system_prompt: str, question: str, context: str) -> str:
        raise NotImplementedError