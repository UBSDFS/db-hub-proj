import React, { useState } from "react";
import "./App.css";

import RedisCrudCard from "./components/RedisCrudCard";
import CommitSearchCard from "./components/CommitSearchCard";
import CommitSearchResults from "./components/CommitSearchResults";
import ApiResponse from "./components/ApiResponse";

function App() {
  const [result, setResult] = useState(null);

  const apiUrl = "http://localhost:8000";

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Database Management Project</p>

        <h1>DB Hub</h1>

        <p className="app-subtitle">
          Manage and explore GitHub Archive data across multiple database
          technologies.
        </p>
      </header>

      <main className="app-grid">
        <RedisCrudCard
          apiUrl={apiUrl}
          onResult={setResult}
        />

        <CommitSearchCard
          apiUrl={apiUrl}
          setResult={setResult}
        />

        {result?.results ? (
          <CommitSearchResults result={result} />
        ) : (
          <ApiResponse result={result} />
        )}
      </main>
    </div>
  );
}

export default App;
