from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app_routes.documents import router as documents_router

app = FastAPI()

# CORS setup so frontend can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, narrow this!
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the route that serves documents
app.include_router(documents_router, prefix="/documents")
