from fastapi import APIRouter, HTTPException, Response
from starlette.responses import JSONResponse
from pathlib import Path
import json

router = APIRouter()

@router.get("/doc/{doc_id}")
def get_document(doc_id: str):
    # Path to mock_documents.json
    file_path = Path(__file__).resolve().parents[1] / "data" / "mock_documents.json"

    # Load JSON data
    try:
        with open(file_path, "r") as file:
            documents = json.load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Document data file not found.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error parsing document data.")

    # Search for the document by ID (case-insensitive)
    for doc in documents:
        if doc["id"].lower() == doc_id.lower():
            return JSONResponse(content=doc)

    raise HTTPException(status_code=404, detail="Document not found.")

@router.get("/documents")
def list_documents():
    file_path = Path(__file__).resolve().parents[1] / "data" / "mock_documents.json"

    try:
        with open(file_path, "r") as file:
            documents = json.load(file)
        return JSONResponse(content=documents)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Document file not found.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error parsing document data.")
