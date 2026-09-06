import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/redis/status")
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.redis);
      })
      .catch((error) => {
        console.error("Error connecting to backend:", error);
        setStatus("Connection failed");
      });
  }, []);

  return (
    <div>
      <h1>DB Hub</h1>
      <h2>Redis Status: {status}</h2>
    </div>
  );
}

export default App;