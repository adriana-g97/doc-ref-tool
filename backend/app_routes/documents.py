from fastapi import APIRouter
from starlette.responses import JSONResponse

router = APIRouter()

@router.get("/doc/{doc_id}")
def get_document(doc_id: str):
    return JSONResponse({
        "id": doc_id,
        "title": "Mock Title",
        "type": "SOP",
        "status": "Active",
        "department": "Testing",
        "date": "2025-01-01",
        "references": ["FORM-123"],
        "referenced_by": ["POL-001"]
    })
