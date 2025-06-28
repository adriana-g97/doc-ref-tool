from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

# Path to the mock JSON file
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'mock_documents.json')

@router.get("/{doc_id}")
def get_document_by_id(doc_id: str):
    try:
        with open(DATA_PATH, 'r') as f:
            documents = json.load(f)
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to load document data.")

    # Find document by ID
    doc = next((d for d in documents if d["ID"] == doc_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return doc
