from fastapi import FastAPI
from redis_client import redis_client
from redis_service import create_commit
from redis_service import (
    create_commit,
    get_commit,
    update_commit,
    delete_commit,
    search_commits
)


from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
origins = [
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CommitUpdate(BaseModel):
    repo_name: Optional[str] = None
    author_name: Optional[str] = None
    author_email: Optional[str] = None
    committer_name: Optional[str] = None
    committer_email: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    tree: Optional[str] = None


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
@app.get("/commits/search")
def search_commits_endpoint(
    repo_name: Optional[str] = None,
    author_name: Optional[str] = None,
    author_email: Optional[str] = None,
    subject: Optional[str] = None
):
    results = search_commits(
        repo_name=repo_name,
        author_name=author_name,
        author_email=author_email,
        subject=subject
    )

    return {
        "count": len(results),
        "results": results
    }

@app.get("/commits/{commit_sha}")
def get_commit_endpoint(commit_sha: str):
    commit = get_commit(commit_sha)

    if not commit:
        raise HTTPException(
            status_code=404,
            detail="Commit not found"
        )

    return commit

@app.put("/commits/{commit_sha}")
def update_commit_endpoint(commit_sha: str, updates: CommitUpdate):
    existing_commit = get_commit(commit_sha)

    if not existing_commit:
        raise HTTPException(
            status_code=404,
            detail="Commit not found"
        )

    update_data = updates.model_dump(exclude_none=True)

    updated_commit = update_commit(commit_sha, update_data)

    return {
        "message": "Commit updated",
        "commit": updated_commit
    }
@app.delete("/commits/{commit_sha}")
def delete_commit_endpoint(commit_sha: str):
    deleted = delete_commit(commit_sha)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Commit not found"
        )

    return {
        "message": "Commit deleted"
    }

# Models for request validation
class Person(BaseModel):
    name: str
    email: str


class CommitCreate(BaseModel):
    commit: str
    repo_name: str
    author: Person
    committer: Person
    subject: str
    message: str
    tree: str

