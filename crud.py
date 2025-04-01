from database import articles_collection, db
from models import Article
from bson import ObjectId
import logging

async def get_all_articles():
    try:        
        articles = await articles_collection.find().to_list(100)
        logging.debug(f"Retrieved articles: {articles}")  # Logging
        for article in articles:
            article["_id"] = str(article["_id"])
        return articles
    except Exception as e:
        logging.error(f"Error fetching articles: {e}", exc_info=True)
        raise

async def get_article(article_id: str):
    try:
        article = await articles_collection.find_one({"_id": ObjectId(article_id)})
        if article:
            article["_id"] = str(article["_id"])
            return article
        else:
            return None
    except Exception as e:
        print (f"error fetching article: {e}")
        return None

async def create_article(article: Article):
    new_article = await articles_collection.insert_one(article.model_dump())
    return str(new_article.inserted_id), {"message": "Article posted successfully"}

async def update_article(article_id: str, article: Article):
    await articles_collection.update_one(
        {"_id": ObjectId(article_id)}, {"$set": article.model_dump()})
    return {"message": "Article updated successfully"}

async def delete_article(article_id: str):
    await articles_collection.delete_one({"_id": ObjectId(article_id)})
    return {"message": "Article deleted successfully"}
