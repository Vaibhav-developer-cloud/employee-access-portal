from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base

from app.models import user_model
from app.models import request_model
from app.models import timeline_model

from app.routers import auth_router
from app.routers import request_router
from app.routers import analytics_router

app = FastAPI(
    title="Employee Access Management API"
)

# 🔥 CORS HERE (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router.router)
app.include_router(request_router.router)
app.include_router(analytics_router.router)


@app.get("/")
def root():
    return {
        "message": "API Running Successfully"
    }