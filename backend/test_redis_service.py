from redis_service import (
    create_commit,
    get_commit,
    update_commit,
    delete_commit
)

deleted = delete_commit("test123")

print("\nDelete result:")
print(deleted)
commit_after_delete = get_commit("test123")

print("\nCommit after delete:")
print(commit_after_delete)