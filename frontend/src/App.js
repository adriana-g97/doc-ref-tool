import { useState } from 'react';
import axios from 'axios';

function App() {
  const [docID, setDocID] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

const handleSearch = async () => {
  setError('');
  console.log("🔍 RAW ENV VALUE:", process.env.REACT_APP_BACKEND_URL);
  console.log("🔍 Requesting:", `${process.env.REACT_APP_BACKEND_URL}/documents/${docID}`);
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/documents/${docID}`
    );
    setResult(response.data);
  } catch (err) {
    console.log("❌ Error fetching:", err);
    setResult(null);
    setError('Document not found');
  }
};


  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📄 Document Lookup</h1>
      <input
        value={docID}
        onChange={(e) => setDocID(e.target.value)}
        placeholder="Enter Document ID (e.g., SOP-001)"
        style={{ marginRight: '1rem', padding: '0.5rem', fontSize: '1rem' }}
      />
      <button onClick={handleSearch} style={{ padding: '0.5rem 1rem' }}>
        Search
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
            backgroundColor: '#f9f9f9'
          }}
        >
          <h2>{result.Title}</h2>
          <p><strong>ID:</strong> {result.ID}</p>
          <p><strong>Type:</strong> {result.Type}</p>
          <p><strong>Status:</strong> {result.Status}</p>
          <p><strong>Date:</strong> {result.Date}</p>
          <p><strong>Department:</strong> {result.Department}</p>
          <p><strong>References:</strong> {result.References.join(', ') || 'None'}</p>
          <p><strong>Referenced By:</strong> {result.ReferencedBy.join(', ') || 'None'}</p>
        </div>
      )}
    </div>
  );
}

export default App;
