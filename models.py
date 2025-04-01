from pydantic import BaseModel
from typing import Optional

class Article(BaseModel):
    title: str
    content: str
    tags: Optional[list[str]] = []
    publish_date: Optional[str] = None
    