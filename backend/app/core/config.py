"""
Configuration settings for the Content Authentication application.
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Find .env file path
env_path = Path(__file__).parents[2] / '.env'

# Load environment variables from .env file
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    """Application settings."""
    PROJECT_NAME: str = "Content Authentication API"
    API_V1_STR: str = "/api/v1"
    
    # Blockchain settings
    GANACHE_URL: str = os.getenv("WEB3_PROVIDER_URI", "http://ganache:8545")
    
    # IPFS settings
    IPFS_CLIENT: str = os.getenv("IPFS_API_URL", "http://ipfs:5001")
    IPFS_BASE_URL: str = os.getenv("IPFS_GATEWAY_URL", "http://ipfs:8080/ipfs")
    
    # CORS settings
    CORS_ORIGINS: list = ["*"]  # Update for production
    
    class Config:
        case_sensitive = True

settings = Settings()