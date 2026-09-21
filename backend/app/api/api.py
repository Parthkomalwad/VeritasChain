"""
Main API router that includes all endpoint routers.
"""
from fastapi import APIRouter
from app.api.endpoints import file_router, api_key_router

api_router = APIRouter()

# Include routers for different resource types
api_router.include_router(file_router.router, prefix="/files", tags=["files"])
api_router.include_router(api_key_router.router, prefix="/api-keys", tags=["api-keys"])
