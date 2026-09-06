import { useState } from "react";

function CommitSearchCard({ apiUrl, setResult }) {
  const [repoName, setRepoName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [subject, setSubject] = useState("");

  const searchCommits = async () => {
    const params = new URLSearchParams();

    if (repoName) {
      params.append("repo_name", repoName);
    }

    if (authorName) {
      params.append("author_name", authorName);
    }

    if (authorEmail) {
      params.append("author_email", authorEmail);
    }

    if (subject) {
      params.append("subject", subject);
    }

    try {
      const response = await fetch(
        `${apiUrl}/commits/search?${params.toString()}`
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      setResult({
        error: "Unable to search commits"
      });
    }
  };

  const clearSearch = () => {
    setRepoName("");
    setAuthorName("");
    setAuthorEmail("");
    setSubject("");
    setResult(null);
  };

  return (
    <section className="card">
      <h2>Search GitHub Commits</h2>

      <input
        type="text"
        placeholder="Repository name"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Author name"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Author email"
        value={authorEmail}
        onChange={(e) => setAuthorEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="Subject keyword"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <div className="button-group">
        <button onClick={searchCommits}>
          Search
        </button>

        <button onClick={clearSearch}>
          Clear
        </button>
      </div>
    </section>
  );
}

export default CommitSearchCard;