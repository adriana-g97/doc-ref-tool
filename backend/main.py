from fastapi import FastAPI
from app_routes import documents

app = FastAPI()
app.include_router(documents.router)
