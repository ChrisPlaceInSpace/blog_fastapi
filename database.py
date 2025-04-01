from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is not set. Check your .env file.")

client = AsyncIOMotorClient(MONGO_URI)
db = client["blog_db"]
articles_collection = db["articles"]

