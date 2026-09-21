"""
Main application entry point for the Content Authentication API.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.utils.logger import setup_logger
from app.api.api import api_router

def create_app() -> FastAPI:
    """Create the FastAPI application."""
    # Setup logger
    logger = setup_logger("backend_logger")
    logger.info("Application starting")
    
    # Initialize FastAPI app
    app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include API router
    app.include_router(api_router, prefix=settings.API_V1_STR)
    
    return app

app = create_app()
