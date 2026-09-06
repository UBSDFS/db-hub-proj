import { useState } from "react";

function RedisCrudCard({ apiUrl, onResult }) {
  const [commitSha, setCommitSha] = useState("");
  const [repoName, setRepoName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const createCommit = async () => {
    const response = await fetch(`${apiUrl}/commits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commit: commitSha,
        repo_name: repoName,
        author: {
          name: authorName,
          email: authorEmail,
        },
        committer: {
          name: authorName,
          email: authorEmail,
        },
        subject,
        message,
        tree: "frontend-tree",
      }),
    });

    const data = await response.json();
    onResult(data);
  };

  const readCommit = async () => {
    const response = await fetch(`${apiUrl}/commits/${commitSha}`);
    const data = await response.json();

    onResult(data);
  };

  const updateCommit = async () => {
    const response = await fetch(`${apiUrl}/commits/${commitSha}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        message,
      }),
    });

    const data = await response.json();
    onResult(data);
  };

  const deleteCommit = async () => {
    const response = await fetch(`${apiUrl}/commits/${commitSha}`, {
      method: "DELETE",
    });

    const data = await response.json();
    onResult(data);
  };

  return (
    <section className="crud-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Database</p>
          <h2>Redis</h2>
        </div>

        <span className="status-badge">Connected</span>
      </div>

      <div className="form-grid">
        <input
          placeholder="Commit SHA"
          value={commitSha}
          onChange={(e) => setCommitSha(e.target.value)}
        />

        <input
          placeholder="Repository Name"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
        />

        <input
          placeholder="Author Name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Author Email"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
        />

        <input
          className="full-width"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          className="full-width"
          placeholder="Commit Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="button-row">
        <button onClick={createCommit}>Create</button>
        <button onClick={readCommit}>Read</button>
        <button onClick={updateCommit}>Update</button>
        <button onClick={deleteCommit}>Delete</button>
      </div>
    </section>
  );
}

export default RedisCrudCard;