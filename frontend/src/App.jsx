import { useState } from "react";
import RedisCrudCard from "./components/RedisCrudCard";
import ApiResponse from "./components/ApiResponse";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);

  const apiUrl = "http://127.0.0.1:8000";

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Database Management Project</p>
        <h1>DB Hub</h1>
        <p>
          Manage and explore GitHub Archive data across multiple database
          technologies.
        </p>
      </header>

      <div className="dashboard-grid">
        <RedisCrudCard
          apiUrl={apiUrl}
          onResult={setResult}
        />

        <ApiResponse result={result} />
      </div>
    </main>
  );
}

export default App;