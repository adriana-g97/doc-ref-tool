import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [docId, setDocId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [docList, setDocList] = useState([]);

  const fetchDocument = async () => {
    try {
      setError('');
      setResult(null);
      const url = `https://fluffy-waffle-4jrrrv9w46g53jvg6-8000.app.github.dev/doc/${docId}`;
      console.log('🧪 Fetching:', url);
      const res = await axios.get(url);
      console.log('✅ Response:', res.data);
      setResult(res.data);
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Document not found or blocked by CORS');
    }
  };

  const fetchAllDocuments = async () => {
    try {
      const res = await axios.get(
        'https://fluffy-waffle-4jrrrv9w46g53jvg6-8000.app.github.dev/documents'
      );
      setDocList(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📘 Document Reference Tool</h1>

      <hr />
      <h2>🔍 Search by ID</h2>
      <input
        type="text"
        value={docId}
        onChange={(e) => setDocId(e.target.value)}
        placeholder="Enter Document ID (e.g., SOP-001)"
        style={{ marginRight: '1rem' }}
      />
      <button onClick={fetchDocument}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
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

      <hr />
      <h2>📄 All Documents</h2>
      {docList.length === 0 ? (
        <p>Loading documents...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {docList.map((doc) => (
            <li
              key={doc.id}
              style={{
                border: '1px solid #ddd',
                padding: '1rem',
                marginBottom: '0.75rem',
                borderRadius: '6px',
              }}
            >
              <strong>{doc.id}</strong>: {doc.title} <br />
              <em>{doc.type} | {doc.status}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
