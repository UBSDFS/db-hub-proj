import json

from redis_service import create_commit
from redis_client import redis_client


FILE_PATH = "../data/GitHubArchive-Dataset/GitHubArchive-Dataset/Sample_Commits.json"


def import_commits(limit=100):
    imported = 0

    with open(FILE_PATH, "r", encoding="utf-8") as file:
        for line in file:
            if imported >= limit:
                break

            commit = json.loads(line)

            key = create_commit(commit)

            commit_sha = commit["commit"]
            repo_name = commit.get("repo_name", "")
            author = commit.get("author", {})
            author_name = author.get("name", "")
            author_email = author.get("email", "")

            if repo_name:
                redis_client.sadd(
                    f"index:repo:{repo_name}",
                    commit_sha
                )

            if author_name:
                redis_client.sadd(
                    f"index:author_name:{author_name}",
                    commit_sha
                )

            if author_email:
                redis_client.sadd(
                    f"index:author_email:{author_email}",
                    commit_sha
                )

            imported += 1

            print(f"Imported: {key}")

    print(f"\nImported {imported} commits.")


if __name__ == "__main__":
    import_commits()