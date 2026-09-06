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


def search_commits(
    repo_name=None,
    author_name=None,
    author_email=None,
    subject=None
):
    commit_shas = set()

    # Search by repository name using Redis index
    if repo_name:
        commit_shas.update(
            redis_client.smembers(f"index:repo:{repo_name}")
        )

    # Search by author name using Redis index
    if author_name:
        commit_shas.update(
            redis_client.smembers(f"index:author_name:{author_name}")
        )

    # Search by author email using Redis index
    if author_email:
        commit_shas.update(
            redis_client.smembers(f"index:author_email:{author_email}")
        )

    # Search commit subjects
    if subject:
        for key in redis_client.scan_iter("commit:*"):
            commit = redis_client.hgetall(key)

            if subject.lower() in commit.get("subject", "").lower():
                commit_sha = key.replace("commit:", "")
                commit_shas.add(commit_sha)

    # Retrieve full commit data for every matching SHA
    results = []

    for commit_sha in commit_shas:
        commit = get_commit(commit_sha)

        if commit:
            commit["commit"] = commit_sha
            results.append(commit)

    return results