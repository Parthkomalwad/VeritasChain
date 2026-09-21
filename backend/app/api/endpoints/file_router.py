"""
API endpoints for file management operations.
"""
from fastapi import APIRouter, UploadFile, Form, HTTPException, Query, Header, Depends, Body
from fastapi.responses import JSONResponse
from web3 import Web3
import os
from typing import Optional, Dict, Any

from app.services.file_service import (
    save_file_to_ipfs_and_blockchain,
    verify_file_on_ipfs,
    fetch_user_transactions,
    fetch_ipfs_data
)
from app.utils.logger import setup_logger
from app.utils.blockchain_helper import interact_with_contract
from app.api.dependencies.auth import verify_api_key_and_wallet
from app.core.config import settings

logger = setup_logger("file_endpoints")
web3 = Web3(Web3.HTTPProvider(settings.GANACHE_URL))

router = APIRouter()

# Public routes
@router.post("/upload")
async def upload_file(
    file: UploadFile,
    file_name: str = Form(...),
    user_address: str = Form(...)
):
    """Upload a file to IPFS and store metadata in blockchain."""
    try:
        user_address = Web3.to_checksum_address(user_address)
        result = await save_file_to_ipfs_and_blockchain(file, file_name, user_address)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while uploading the file.")

@router.get("/verify")
async def verify_ipfs_file(file_hash: str = Query(...)):
    """Verify a file using its IPFS hash."""
    try:
        result = verify_file_on_ipfs(file_hash)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error verifying file: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while verifying the file on IPFS.")

@router.get("/transactions")
async def get_user_transactions(user_address: str = Query(...)):
    """Get all transactions for a specific user."""
    try:
        result = fetch_user_transactions(user_address)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error fetching transactions: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching user transactions.")

@router.get("/ipfs-data")
async def get_ipfs_data(file_hash: str = Query(...)):
    """Get data from IPFS for a file hash."""
    try:
        result = fetch_ipfs_data(file_hash)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error fetching IPFS data: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching data from IPFS.")

@router.get("/hash-by-transaction")
async def get_file_hash_by_transaction(transaction_id: str = Query(...)):
    """Get the file hash associated with a transaction ID."""
    try:
        file_hash = interact_with_contract("getFileHashByTransaction", transaction_id)
        return JSONResponse(content={"file_hash": file_hash})
    except Exception as e:
        logger.error(f"Error fetching file hash by transaction: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching the file hash.")

@router.get("/all-hashes")
async def get_all_file_hashes(user_address: str = Query(...)):
    """Get all file hashes for a specific user."""
    try:
        user_address = Web3.to_checksum_address(user_address)
        file_hash_map = {}
        # Call getAllFileHashes with the user's address as sender
        file_hashes, file_names, time_stamp = interact_with_contract("getAllFileHashes", sender_address=user_address)
        
        # Combine names and hashes into dict
        for name, hash, time in zip(file_names, file_hashes, time_stamp):
            file_hash_map[name] = {
                "hash": hash,
                "time_stamp": time,
            }
        
        return JSONResponse(content={"file_hashes": file_hash_map})
    except Exception as e:
        logger.error(f"Error fetching all file hashes: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching file hashes.")

# Protected developer routes
@router.post("/developer/upload", dependencies=[Depends(verify_api_key_and_wallet)])
async def upload_file_protected(
    file: UploadFile,
    file_name: str = Form(...),
    user_address: str = Form(...)
):
    """Protected route for file uploads."""
    return await upload_file(file, file_name, user_address)

@router.get("/developer/transactions", dependencies=[Depends(verify_api_key_and_wallet)])
async def fetch_transactions_protected(user_address: str = Query(...)):
    """Protected route to fetch user transactions."""
    return await get_user_transactions(user_address)

@router.get("/developer/files-with-urls", dependencies=[Depends(verify_api_key_and_wallet)])
async def fetch_files_with_urls_protected(user_address: str = Query(...)):
    """Protected route to fetch files with their URLs."""
    try:
        user_address = Web3.to_checksum_address(user_address)
        file_hash_map = {}
        # Call getAllFileHashes with the user's address as sender
        file_hashes, file_names, time_stamps = interact_with_contract("getAllFileHashes", sender_address=user_address)

        # Combine names, hashes, and URLs into dict
        for name, hash in zip(file_names, file_hashes):
            file_hash_map[name] = {
                "hash": hash,
                "url": f"{settings.IPFS_BASE_URL}/{hash}"
            }

        return JSONResponse(content={"file_hashes": file_hash_map})
    except Exception as e:
        logger.error(f"Error in fetch_files_with_urls_protected: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching files.")

@router.delete("/developer/delete", dependencies=[Depends(verify_api_key_and_wallet)])
async def delete_file_protected(file_hash: str = Query(...)):
    """Protected route to delete a file."""
    try:
        result = interact_with_contract("deleteFile", file_hash)
        return JSONResponse(content={"result": result})
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting the file.")

@router.get("/developer/transaction-details", dependencies=[Depends(verify_api_key_and_wallet)])
async def get_transaction_details_protected(tx_hash: str = Query(...)):
    """Protected route to get transaction details."""
    try:
        transaction_details = interact_with_contract("getTransactionDetails", tx_hash)
        return JSONResponse(content={"transaction_details": transaction_details})
    except Exception as e:
        logger.error(f"Error getting transaction details: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching transaction details.")

@router.get("/developer/blockchain-stats", dependencies=[Depends(verify_api_key_and_wallet)])
async def get_blockchain_stats_protected():
    """Protected route to get blockchain stats."""
    try:
        stats = {
            "block_height": web3.eth.block_number,
            "gas_price": web3.eth.gas_price
        }
        return JSONResponse(content={"blockchain_stats": stats})
    except Exception as e:
        logger.error(f"Error getting blockchain stats: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching blockchain stats.")

@router.get("/developer/balance", dependencies=[Depends(verify_api_key_and_wallet)])
async def get_user_balance_protected(user_address: str = Query(...)):
    """Protected route to get a user's balance."""
    try:
        user_address = Web3.to_checksum_address(user_address)
        balance = web3.eth.get_balance(user_address)
        balance_in_eth = float(web3.from_wei(balance, "ether"))
        return JSONResponse(content={"balance": balance_in_eth})
    except Exception as e:
        logger.error(f"Error getting user balance: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching user balance.")

@router.put("/developer/update-metadata", dependencies=[Depends(verify_api_key_and_wallet)])
async def update_file_metadata_protected(
    file_hash: str = Query(...),
    metadata: Dict[str, Any] = Body(...)
):
    """Protected route to update file metadata."""
    try:
        result = interact_with_contract("updateFileMetadata", file_hash, metadata)
        return JSONResponse(content={"result": result})
    except Exception as e:
        logger.error(f"Error updating file metadata: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while updating file metadata.")

@router.get("/developer/search", dependencies=[Depends(verify_api_key_and_wallet)])
async def search_files_protected(query: str = Query(...)):
    """Protected route to search for files."""
    try:
        matching_files = interact_with_contract("searchFiles", query)
        return JSONResponse(content={"matching_files": matching_files})
    except Exception as e:
        logger.error(f"Error searching files: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while searching for files.")

@router.get("/developer/recent-transactions", dependencies=[Depends(verify_api_key_and_wallet)])
async def get_recent_transactions_protected(limit: int = Query(10)):
    """Protected route to get recent transactions."""
    try:
        transactions = interact_with_contract("getRecentTransactions", limit)
        return JSONResponse(content={"recent_transactions": transactions})
    except Exception as e:
        logger.error(f"Error getting recent transactions: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching recent transactions.")
