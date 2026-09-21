"""
Service module for API key management operations.
"""
from typing import Dict, Optional

from app.utils.logger import setup_logger
from app.utils.api_key_helper import (
    generate_api_key_string,
    store_api_key,
    get_api_key_by_wallet,
    validate_api_key as validate_key,
    delete_api_key as delete_key
)

# Setup logger
logger = setup_logger("api_key_service")

async def generate_api_key(wallet_address: str) -> Dict[str, str]:
    """
    Generate a new API key for the given wallet address.
    
    Args:
        wallet_address: The blockchain wallet address to associate with the API key
        
    Returns:
        Dictionary with wallet address and generated API key
    """
    if not wallet_address:
        logger.error("No wallet address provided")
        raise ValueError("Wallet address is required")
    
    try:
        # Generate and store the API key
        api_key = generate_api_key_string(wallet_address)
        store_api_key(wallet_address, api_key)
        logger.info(f"Generated API key for wallet address: {wallet_address}")
        
        return {"walletAddress": wallet_address, "apiKey": api_key}
    except Exception as e:
        logger.error(f"Error generating API key: {str(e)}")
        raise

async def get_api_key(wallet_address: str) -> Dict[str, str]:
    """
    Get the API key for the given wallet address if it exists.
    
    Args:
        wallet_address: The blockchain wallet address to retrieve the API key for
        
    Returns:
        Dictionary with wallet address, API key, and creation timestamp
    """
    result = get_api_key_by_wallet(wallet_address)
    if not result:
        logger.warning(f"No API key found for wallet address: {wallet_address}")
        raise ValueError("No API key found for this wallet address")
    
    logger.info(f"Retrieved API key for wallet address: {wallet_address}")
    return {
        "walletAddress": wallet_address,
        "apiKey": result["api_key"],
        "createdAt": result["created_at"]
    }

async def regenerate_api_key(wallet_address: str) -> Dict[str, str]:
    """
    Regenerate the API key for the given wallet address.
    
    Args:
        wallet_address: The blockchain wallet address to regenerate the API key for
        
    Returns:
        Dictionary with wallet address and newly generated API key
    """
    try:
        # Delete existing key if it exists
        delete_key(wallet_address)
        logger.info(f"Deleted existing API key for wallet address: {wallet_address}")
        
        # Generate and store new key
        return await generate_api_key(wallet_address)
    except Exception as e:
        logger.error(f"Error regenerating API key: {str(e)}")
        raise

async def delete_api_key(wallet_address: str) -> Dict[str, bool]:
    """
    Delete the API key for the given wallet address.
    
    Args:
        wallet_address: The blockchain wallet address to delete the API key for
        
    Returns:
        Dictionary with success status and message
    """
    result = delete_key(wallet_address)
    if not result:
        logger.warning(f"No API key found to delete for wallet address: {wallet_address}")
        raise ValueError("No API key found for this wallet address")
    
    logger.info(f"Successfully deleted API key for wallet address: {wallet_address}")
    return {"success": True, "message": "API key deleted successfully"}

def validate_api_key(api_key: str) -> Optional[str]:
    """
    Validate an API key and return the wallet address if valid.
    
    Args:
        api_key: The API key to validate
        
    Returns:
        The associated wallet address if valid, None otherwise
    """
    if not api_key:
        logger.warning("Empty API key provided for validation")
        return None
    
    wallet_address = validate_key(api_key)
    if wallet_address:
        logger.info(f"Successfully validated API key for wallet address: {wallet_address}")
    else:
        logger.warning("Invalid API key provided for validation")
    
    return wallet_address
