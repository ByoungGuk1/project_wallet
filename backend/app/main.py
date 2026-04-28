from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models  # noqa: F401
from app.api import (
    account_router,
    category_router,
    statistics_router,
    transaction_router,
)
from app.database.connection import create_tables

app = FastAPI(title="개인 자산 관리 서비스 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_tables()


@app.get("/")
def health_check():
    return {"message": "Personal Asset Management API"}


app.include_router(account_router.router)
app.include_router(transaction_router.router)
app.include_router(category_router.router)
app.include_router(statistics_router.router)
