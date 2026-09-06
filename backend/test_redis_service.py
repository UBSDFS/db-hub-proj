from redis_service import search_commits

results = search_commits(repo_name="torvalds/linux")

print(f"\nFound {len(results)} commits")

for commit in results[:5]:
    print(
        commit["commit"],
        commit["repo_name"],
        commit["author_name"],
        commit["subject"]
    )