from fastapi import APIRouter, HTTPException
import json
from pathlib import Path

router = APIRouter()

@router.get("/documents/{doc_id}")
def get_document(doc_id: str):
    file_path = Path(__file__).resolve().parents[1] / "data" / "mock_documents.json"
    with open(file_path, "r") as file:
        documents = json.load(file)

    for doc in documents:
        if doc["id"].lower() == doc_id.lower():
            return doc

    raise HTTPException(status_code=404, detail="Document not found")
