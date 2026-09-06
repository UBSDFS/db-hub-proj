from fastapi import FastAPI
from redis_client import redis_client

app = FastAPI()


@app.get("/")
def home():
    return {"message": "DB Hub API is running"}


@app.get("/redis/status")
def redis_status():
    try:
        redis_client.ping()

        return {
            "redis": "connected"
        }

    except Exception as error:
        return {
            "redis": "disconnected",
            "error": str(error)
        }