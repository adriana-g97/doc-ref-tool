from fastapi import APIRouter, HTTPException
from utils.notion_loader import get_notion_documents
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/documents")
def list_documents():
    documents = get_notion_documents()
    return JSONResponse(content=documents)

@router.get("/doc/{doc_id}")
def get_document(doc_id: str):
    documents = get_notion_documents()
    for doc in documents:
        if doc["id"].lower() == doc_id.lower():
            return JSONResponse(content=doc)
    raise HTTPException(status_code=404, detail="Document not found")
