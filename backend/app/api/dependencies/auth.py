"""
Authentication dependencies for API routes.
"""
from fastapi import Depends, HTTPException, Header, Query
from typing import Optional

from app.services.api_key_service import validate_api_key
from app.utils.logger import setup_logger

logger = setup_logger("auth_dependencies")

async def verify_api_key(x_api_key: str = Header(...)) -> str:
    """
    Verify the provided API key is valid.
    
    Args:
        x_api_key: API key from the request header
        
    Returns:
        Associated wallet address if the key is valid
        
    Raises:
        HTTPException: If the API key is invalid
    """
    wallet_address = validate_api_key(x_api_key)
    if not wallet_address:
        logger.warning(f"Invalid API key provided: {x_api_key}")
        raise HTTPException(status_code=401, detail="Invalid API key")
    return wallet_address

async def verify_api_key_and_wallet(x_api_key: str = Header(...), user_address: Optional[str] = Query(None)) -> str:
    """
    Verify the API key is valid and optionally check it matches the provided wallet address.
    
    Args:
        x_api_key: API key from the request header
        user_address: Optional wallet address to verify against the API key
        
    Returns:
        Associated wallet address if the key is valid
        
    Raises:
        HTTPException: If the API key is invalid or doesn't match the provided address
    """
    wallet_address = await verify_api_key(x_api_key)
    
    # If user_address is provided, verify it matches the wallet address associated with the API key
    if user_address and user_address.lower() != wallet_address.lower():
        logger.warning(f"API key wallet address mismatch: {wallet_address} vs {user_address}")
        raise HTTPException(status_code=403, detail="API key does not match the provided wallet address")
    
    return wallet_address

async def require_api_key_and_wallet(x_api_key: str = Header(...), user_address: str = Query(...)) -> str:
    """
    Require both API key and wallet address, ensuring they match.
    
    Args:
        x_api_key: API key from the request header
        user_address: Required wallet address to verify against the API key
        
    Returns:
        Associated wallet address if the key is valid and matches
        
    Raises:
        HTTPException: If the API key is invalid or doesn't match the provided address
    """
    return await verify_api_key_and_wallet(x_api_key, user_address)
