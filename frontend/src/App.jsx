import { useState } from "react";

function App() {
  const [commitSha, setCommitSha] = useState("");
  const [repoName, setRepoName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const apiUrl = "http://127.0.0.1:8000";

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
        subject: subject,
        message: message,
        tree: "frontend-tree",
      }),
    });

    const data = await response.json();
    setResult(data);
  };

  const readCommit = async () => {
    const response = await fetch(`${apiUrl}/commits/${commitSha}`);
    const data = await response.json();

    setResult(data);
  };

  const updateCommit = async () => {
    const response = await fetch(`${apiUrl}/commits/${commitSha}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: subject,
        message: message,
      }),
    });

    const data = await response.json();
    setResult(data);
  };

  const deleteCommit = async () => {
    const response = await fetch(`${apiUrl}/commits/${commitSha}`, {
      method: "DELETE",
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <h1>DB Hub</h1>

      <div>
        <h2>Redis Commit CRUD</h2>

        <input
          type="text"
          placeholder="Commit SHA"
          value={commitSha}
          onChange={(e) => setCommitSha(e.target.value)}
        />

        <input
          type="text"
          placeholder="Repository Name"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
        />

        <input
          type="text"
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
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="Commit Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div>
          <button onClick={createCommit}>Create</button>
          <button onClick={readCommit}>Read</button>
          <button onClick={updateCommit}>Update</button>
          <button onClick={deleteCommit}>Delete</button>
        </div>
      </div>

      <div>
        <h3>API Response</h3>

        <pre>
          {result ? JSON.stringify(result, null, 2) : "No response yet"}
        </pre>
      </div>
    </div>
  );
}

export default App;