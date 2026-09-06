function CommitSearchResults({ result }) {
  if (!result) {
    return null;
  }

  if (result.error) {
    return (
      <section className="card">
        <p>{result.error}</p>
      </section>
    );
  }

  if (!result.results) {
    return null;
  }

  if (result.results.length === 0) {
    return (
      <section className="search-results">
        <h2>Search Results</h2>
        <p>No commits found.</p>
      </section>
    );
  }

  return (
    <section className="search-results">
      <div className="results-header">
        <h2>Search Results</h2>
        <span>{result.count} commits found</span>
      </div>

      <div className="commit-list">
        {result.results.map((commit) => (
          <article
            className="commit-result"
            key={commit.commit}
          >
            <h3>{commit.subject || "No subject"}</h3>

            <div className="commit-meta">
              <p>
                <strong>Repository:</strong> {commit.repo_name}
              </p>

              <p>
                <strong>Author:</strong> {commit.author_name}
              </p>

              <p>
                <strong>Email:</strong> {commit.author_email}
              </p>
            </div>

            <div className="sha-row">
              <strong>SHA:</strong>
              <code>{commit.commit}</code>
            </div>

            {commit.message && (
              <p className="commit-message">
                {commit.message}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default CommitSearchResults;