"""
Pydantic schemas for API key operations.
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ApiKeyResponse(BaseModel):
    """Response model for API key operations."""
    wallet_address: str = Field(..., description="Ethereum wallet address")
    api_key: str = Field(..., description="Generated API key")
    created_at: Optional[datetime] = Field(None, description="Timestamp when the API key was created")

class ApiKeyRequest(BaseModel):
    """Request model for API key operations."""
    wallet_address: str = Field(..., description="Ethereum wallet address")

class ApiKeyDeleteResponse(BaseModel):
    """Response model for API key deletion."""
    success: bool = Field(..., description="Success status of the operation")
    message: str = Field(..., description="Description of the operation result")
