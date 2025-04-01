from fastapi import FastAPI, Request
from routers.articles import router as articles_router
import logging

app = FastAPI()

# Enable logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        logger.error(f"Unhandled error: {str(e)}")
        return {"error": "Internal Server Error"}

app.include_router(articles_router)
