import { useState } from 'react';
import axios from 'axios';

function App() {
  const [docId, setDocId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const fetchDocument = async () => {
    try {
      setError('');
      setResult(null);
      const url = `https://fluffy-waffle-4jrrrv9w46g53jvg6-8000.app.github.dev/doc/${docId}`;
      console.log("🧪 Fetching:", url);
      const res = await axios.get(url);
      console.log("✅ Response:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error("❌ Error:", err);
      setError('Document not found or blocked by CORS');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📘 Document Reference Tool</h1>
      <input
        type="text"
        value={docId}
        onChange={(e) => setDocId(e.target.value)}
        placeholder="Enter Document ID (e.g., SOP-001)"
      />
      <button onClick={fetchDocument}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '1rem' }}>
          <h3>{result.title}</h3>
          <p><strong>ID:</strong> {result.id}</p>
          <p><strong>Type:</strong> {result.type}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Department:</strong> {result.department}</p>
          <p><strong>Date:</strong> {result.date}</p>
          <p><strong>References:</strong> {result.references.join(', ')}</p>
          <p><strong>Referenced By:</strong> {result.referenced_by.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default App;
