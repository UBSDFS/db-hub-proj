from redis_client import redis_client


def create_commit(commit_data):
    commit_sha = commit_data["commit"]

    key = f"commit:{commit_sha}"

    commit_hash = {
        "repo_name": commit_data.get("repo_name", ""),
        "author_name": commit_data.get("author", {}).get("name", ""),
        "author_email": commit_data.get("author", {}).get("email", ""),
        "committer_name": commit_data.get("committer", {}).get("name", ""),
        "committer_email": commit_data.get("committer", {}).get("email", ""),
        "subject": commit_data.get("subject", ""),
        "message": commit_data.get("message", ""),
        "tree": commit_data.get("tree", "")
    }

    redis_client.hset(key, mapping=commit_hash)

    return key


def get_commit(commit_sha):
    key = f"commit:{commit_sha}"

    commit = redis_client.hgetall(key)

    return commit


def update_commit(commit_sha, updates):
    key = f"commit:{commit_sha}"

    redis_client.hset(key, mapping=updates)

    return redis_client.hgetall(key)

def delete_commit(commit_sha):
    key = f"commit:{commit_sha}"

    deleted = redis_client.delete(key)

    return deleted