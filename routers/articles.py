from fastapi import APIRouter, HTTPException
from crud import get_all_articles, get_article, create_article, update_article, delete_article
from models import Article

router = APIRouter()

@router.get("/articles")
async def list_of_articles():
    return await get_all_articles()

@router.get("/articles/{article_id}")
async def get_single_article(article_id: str):
    article = await get_article(article_id)
    if article:
        return article
    raise HTTPException(status_code=404, detail="Article not found")

@router.post("/articles")
async def create_new_article(article: Article):
    article_id = await create_article(article)
    return {"id": article_id}

@router.put("/articles/{article_id}")
async def change_article(article_id: str, article: Article):
    return await update_article(article_id, article)

@router.delete("/articles/{article_id}")
async def remove_article(article_id: str):
    return await delete_article(article_id)