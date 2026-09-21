"""
API endpoints for API key management.
"""
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from app.services.api_key_service import generate_api_key, get_api_key, regenerate_api_key, delete_api_key
from app.utils.logger import setup_logger

logger = setup_logger("api_key_endpoints")

router = APIRouter()

@router.post("/generate")
async def generate_api_key_endpoint(user_address: str = Query(..., description="Ethereum wallet address")):
    """Generate a new API key for the given wallet address."""
    try:
        result = await generate_api_key(user_address)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error generating API key: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the API key.")

@router.get("/get/{user_address}")
async def get_api_key_endpoint(user_address: str):
    """Get the API key for the given wallet address."""
    try:
        result = await get_api_key(user_address)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error getting API key: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while retrieving the API key.")

@router.post("/regenerate")
async def regenerate_api_key_endpoint(user_address: str = Query(..., description="Ethereum wallet address")):
    """Regenerate the API key for the given wallet address."""
    try:
        result = await regenerate_api_key(user_address)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error regenerating API key: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while regenerating the API key.")

@router.delete("/delete/{user_address}")
async def delete_api_key_endpoint(user_address: str):
    """Delete the API key for the given wallet address."""
    try:
        result = await delete_api_key(user_address)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error deleting API key: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting the API key.")
