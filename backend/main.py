from fastapi import FastAPI
from redis_client import redis_client
from redis_service import create_commit
from redis_service import get_commit, update_commit, delete_commit

app = FastAPI()


@app.get("/")
def home():
    return {"message": "DB Hub API is running"}


@app.get("/redis/status")
def redis_status():
    try:
        redis_client.ping()
        return {"redis": "connected"}
    except Exception as error:
        return {
            "redis": "disconnected",
            "error": str(error)
        }


@app.post("/commits")
def create_commit_endpoint(commit_data: dict):
    key = create_commit(commit_data)

    return {
        "message": "Commit created",
        "key": key
    }
@app.get("/commits/{commit_sha}")
def get_commit_endpoint(commit_sha: str):
    commit = get_commit(commit_sha)

    return commit
@app.put("/commits/{commit_sha}")
def update_commit_endpoint(commit_sha: str, updates: dict):
    updated_commit = update_commit(commit_sha, updates)

    return {
        "message": "Commit updated",
        "commit": updated_commit
    }
@app.delete("/commits/{commit_sha}")
def delete_commit_endpoint(commit_sha: str):
    deleted = delete_commit(commit_sha)

    return {
        "message": "Commit deleted" if deleted else "Commit not found",
        "deleted": bool(deleted)
    }