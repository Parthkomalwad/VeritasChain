"""
Utility functions for API key management.
"""
import secrets
import string
import json
import os
from datetime import datetime
from typing import Dict, Optional
from pathlib import Path

from app.utils.logger import setup_logger

# Setup logger
logger = setup_logger("api_key_helper")

# JSON file path for API keys storage
API_KEYS_FILE = Path(__file__).parents[2] / "api_keys" / "api_keys.json"

# Ensure data directory exists
os.makedirs(API_KEYS_FILE.parent, exist_ok=True)

def _load_api_keys() -> Dict[str, Dict[str, str]]:
    """Load API keys from JSON file."""
    try:
        if API_KEYS_FILE.exists():
            with open(API_KEYS_FILE, 'r') as f:
                return json.load(f)
        return {}
    except Exception as e:
        logger.error(f"Error loading API keys: {str(e)}")
        return {}

def _save_api_keys(api_keys: Dict[str, Dict[str, str]]) -> None:
    """Save API keys to JSON file."""
    try:
        # Ensure directory exists
        os.makedirs(API_KEYS_FILE.parent, exist_ok=True)
        
        with open(API_KEYS_FILE, 'w') as f:
            json.dump(api_keys, f, indent=2)
        logger.info(f"API keys saved to {API_KEYS_FILE}")
    except Exception as e:
        logger.error(f"Error saving API keys: {str(e)}")

def generate_api_key_string(wallet_address: str) -> str:
    """
    Generate a secure API key string.
    
    Args:
        wallet_address: Blockchain wallet address
        
    Returns:
        Generated API key
    """
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    prefix = "cg"  # ContentGuard
    random_part = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(16))
    api_key = f"{prefix}-{random_part}-{timestamp}"
    
    return api_key

def store_api_key(wallet_address: str, api_key: str) -> None:
    """
    Store an API key for a wallet address.
    
    Args:
        wallet_address: Blockchain wallet address
        api_key: API key to store
    """
    api_keys = _load_api_keys()
    
    api_keys[wallet_address] = {
        "api_key": api_key,
        "created_at": datetime.now().isoformat()
    }
    
    _save_api_keys(api_keys)
    logger.info(f"Stored API key for wallet {wallet_address[:6]}...{wallet_address[-4:]}")

def get_api_key_by_wallet(wallet_address: str) -> Optional[Dict[str, str]]:
    """
    Get the API key data for a wallet address.
    
    Args:
        wallet_address: Blockchain wallet address
        
    Returns:
        Dictionary with API key and creation timestamp, or None if not found
    """
    api_keys = _load_api_keys()
    
    if wallet_address in api_keys:
        return api_keys[wallet_address]
    return None

def validate_api_key(api_key: str) -> Optional[str]:
    """
    Validate an API key and return the associated wallet address if valid.
    
    Args:
        api_key: API key to validate
        
    Returns:
        Associated wallet address if valid, None otherwise
    """
    api_keys = _load_api_keys()
    
    for wallet_address, data in api_keys.items():
        if data["api_key"] == api_key:
            return wallet_address
    return None

def delete_api_key(wallet_address: str) -> bool:
    """
    Delete an API key for a wallet address.
    
    Args:
        wallet_address: Blockchain wallet address
        
    Returns:
        Boolean indicating if deletion was successful
    """
    api_keys = _load_api_keys()
    
    if wallet_address in api_keys:
        del api_keys[wallet_address]
        _save_api_keys(api_keys)
        logger.info(f"Deleted API key for wallet {wallet_address[:6]}...{wallet_address[-4:]}")
        return True
    return False
