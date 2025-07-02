from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app_routes import documents

app = FastAPI()

origins = [
    "https://fluffy-waffle-4jrrrv9w46g53jvg6-5173.app.github.dev"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router)
