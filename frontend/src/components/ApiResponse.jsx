function ApiResponse({ result }) {
  return (
    <section className="response-card">
      <p className="eyebrow">Backend Response</p>
      <h2>API Output</h2>

      <pre>
        {result
          ? JSON.stringify(result, null, 2)
          : "Run a CRUD operation to see the response."}
      </pre>
    </section>
  );
}

export default ApiResponse;