from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app_routes.documents import router as documents_router

app = FastAPI()

# CORS setup for GitHub Codespaces
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fluffy-waffle-4jrrrv9w46g53jvg6-3000.app.github.dev"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the document route
app.include_router(documents_router, prefix="/documents")
