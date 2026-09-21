"""
Service module for file-related operations including IPFS and blockchain interactions.
"""
import aiofiles
import os
from fastapi import UploadFile

from app.utils.blockchain_helper import store_metadata_on_blockchain, fetch_transactions_for_user
from app.utils.ipfs_helper import upload_to_ipfs, check_file_on_ipfs, retrieve_ipfs_data
from app.utils.logger import setup_logger

logger = setup_logger("file_service")

async def save_file_to_ipfs_and_blockchain(file: UploadFile, file_name: str, user_address: str):
    """
    Upload a file to IPFS and store its metadata on the blockchain.
    
    Args:
        file: The file to upload
        file_name: The name to assign to the file
        user_address: The blockchain address of the file owner
        
    Returns:
        Dictionary with upload results including IPFS hash and transaction receipt
    """
    try:
        # Save the file locally in a temporary location
        file_path = f"temp_{file.filename}"
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        # Upload the file to IPFS
        ipfs_hash = upload_to_ipfs(file_path)
        logger.info(f"Uploaded file to IPFS with hash: {ipfs_hash}")

        # Remove the temporary file after uploading to IPFS
        os.remove(file_path)

        # Store metadata on the blockchain
        tx_receipt = store_metadata_on_blockchain(ipfs_hash, file_name, user_address)

        # Handle both types of responses (HexBytes and already converted strings)
        if isinstance(tx_receipt['transactionHash'], bytes):
            tx_receipt['transactionHash'] = tx_receipt['transactionHash'].hex()
        if isinstance(tx_receipt['blockHash'], bytes):
            tx_receipt['blockHash'] = tx_receipt['blockHash'].hex()
        if isinstance(tx_receipt['logsBloom'], bytes):
            tx_receipt['logsBloom'] = tx_receipt['logsBloom'].hex()

        logger.info(f"Stored metadata on blockchain, transaction hash: {tx_receipt['transactionHash']}")
        return {
            "message": "File uploaded successfully",
            "ipfs_hash": ipfs_hash,
            "transaction_receipt": tx_receipt
        }
    except Exception as e:
        logger.error(f"Error saving file to IPFS and blockchain: {str(e)}")
        raise

def verify_file_on_ipfs(file_hash: str):
    """
    Verify if a file exists on IPFS using its hash.
    
    Args:
        file_hash: The IPFS hash of the file to verify
        
    Returns:
        Dictionary with file existence status
    """
    try:
        exists = check_file_on_ipfs(file_hash)
        logger.info(f"Verified file on IPFS with hash {file_hash}, exists: {exists}")
        return {"file_exists": exists}
    except Exception as e:
        logger.error(f"Error verifying file on IPFS: {str(e)}")
        raise

def fetch_user_transactions(user_address: str):
    """
    Fetch all blockchain transactions for a user address.
    
    Args:
        user_address: The blockchain address of the user
        
    Returns:
        Dictionary with user transactions
    """
    try:
        transactions = fetch_transactions_for_user(user_address)
        logger.info(f"Fetched {len(transactions)} transactions for user {user_address}")
        return {"transactions": transactions}
    except Exception as e:
        logger.error(f"Error fetching user transactions: {str(e)}")
        raise

def fetch_ipfs_data(file_hash: str):
    """
    Retrieve data stored in IPFS for a given file hash.
    
    Args:
        file_hash: The IPFS hash of the file to retrieve
        
    Returns:
        Dictionary with file data from IPFS
    """
    try:
        data = retrieve_ipfs_data(file_hash)
        logger.info(f"Fetched data from IPFS for hash {file_hash}")
        return {"data": data}
    except Exception as e:
        logger.error(f"Error fetching data from IPFS: {str(e)}")
        raise
