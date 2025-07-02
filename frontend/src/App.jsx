import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [docId, setDocId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [docList, setDocList] = useState([]);

  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');

  const fetchDocument = async (idOverride) => {
    const queryId = idOverride || docId;

    try {
      setError('');
      setResult(null);
      const url = `https://fluffy-waffle-4jrrrv9w46g53jvg6-8000.app.github.dev/doc/${queryId}`;
      const res = await axios.get(url);
      setResult(res.data);
      setDocId(queryId); // update search box
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

  const filteredDocs = docList.filter((doc) => {
    return (
      (filterType === '' || (doc.type ?? '') === filterType) &&
      (filterStatus === '' || (doc.status ?? '') === filterStatus) &&
      (filterDept === '' || (doc.department ?? '') === filterDept)
    );
  });

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
      <button onClick={() => fetchDocument()}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h3>{result.title}</h3>
          <p><strong>ID:</strong> {result.id}</p>
          <p><strong>Type:</strong> {result.type || 'Missing Type'}</p>
          <p><strong>Status:</strong> {result.status || 'Missing Status'}</p>
          <p><strong>Department:</strong> {result.department || 'Missing Dept'}</p>
          <p><strong>Date:</strong> {result.date}</p>

          <p>
            <strong>References:</strong>{' '}
            {result.references.length === 0 ? 'None' : result.references.map((ref, i) => (
              <span key={i} style={{ marginRight: '0.5rem' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); fetchDocument(ref); }}>
                  {ref}
                </a>
              </span>
            ))}
          </p>

          <p>
            <strong>Referenced By:</strong>{' '}
            {result.referenced_by.length === 0 ? 'None' : result.referenced_by.map((ref, i) => (
              <span key={i} style={{ marginRight: '0.5rem' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); fetchDocument(ref); }}>
                  {ref}
                </a>
              </span>
            ))}
          </p>
        </div>
      )}

      <hr />
      <h2>📄 All Documents</h2>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="SOP">SOP</option>
          <option value="Form">Form</option>
          <option value="External">External</option>
          <option value="POL">POL</option>
          <option value="WI">WI</option>
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Review/Revision">Review/Revision</option>
          <option value="Pending">Pending</option>
          <option value="Obsolete">Obsolete</option>
        </select>

        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="">All Departments</option>
          {[
            "Admin", "Bacteriology", "Branch", "Forsyth", "Histology", "LBS", "LMS",
            "Media", "Necropsy", "NPIP", "NVSL", "Other", "PHS", "Quality", "Receiving",
            "Safety", "Serology", "Tifton", "Virology"
          ].map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {filteredDocs.length === 0 ? (
        <p>No documents match your filters.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredDocs.map((doc) => (
            <li
              key={doc.id}
              style={{
                border: '1px solid #ddd',
                padding: '1rem',
                marginBottom: '0.75rem',
                borderRadius: '6px',
              }}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  fetchDocument(doc.id);
                }}
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <strong>{doc.id}</strong>: {doc.title}
              </a>
              <br />
              <em>
                {doc.type || 'Missing Type'} | {doc.status || 'Missing Status'} | {doc.department || 'Missing Dept'}
              </em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
