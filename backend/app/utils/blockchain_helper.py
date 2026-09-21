"""
Utility functions for blockchain interactions.
"""
from web3 import Web3
import json
import os
from pathlib import Path

from app.core.config import settings
from app.utils.logger import setup_logger

logger = setup_logger("blockchain_helper")

# Connect to blockchain
web3 = Web3(Web3.HTTPProvider(settings.GANACHE_URL))
web3.eth.default_account = web3.eth.accounts[0]

# Load the smart contract
contract_path = Path(__file__).parents[2].parent / "contracts" / "build" / "contracts" / "UserFileStorage.json"
with open(contract_path) as f:
    contract_data = json.load(f)

# Dynamically get the first network ID from the deployed networks
network_ids = list(contract_data["networks"].keys())
if not network_ids:
    raise ValueError("No deployed networks found in the contract JSON file")

# Use the first available network ID
network_id = network_ids[-1]
contract_address = contract_data["networks"][network_id]["address"]
logger.info(f"Using contract at address {contract_address} from network ID {network_id}")
contract_abi = contract_data["abi"]
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

def store_metadata_on_blockchain(ipfs_hash: str, file_name: str, user_address: str):
    """
    Store file metadata on the blockchain.
    
    Args:
        ipfs_hash: IPFS hash of the uploaded file
        file_name: Name of the file
        user_address: Blockchain address of the user
        
    Returns:
        Dictionary with transaction receipt details
    """
    try:
        # Ensure address is checksum format
        user_address = Web3.to_checksum_address(user_address)
        
        tx_hash = contract.functions.uploadFile(ipfs_hash, file_name).transact({"from": user_address})
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        # Convert AttributeDict to a serializable dictionary
        tx_receipt_dict = dict(tx_receipt)
        tx_receipt_dict["logs"] = [dict(log) for log in tx_receipt_dict["logs"]]

        # Map the transaction hash to the IPFS hash
        transaction_hash = tx_receipt["transactionHash"].hex()
        contract.functions.mapTransactionToIPFS(transaction_hash, ipfs_hash).transact({"from": user_address})
        
        logger.info(f"Stored metadata on blockchain for file: {file_name}, hash: {ipfs_hash}")
        return tx_receipt_dict
    except Exception as e:
        logger.error(f"Error storing metadata on blockchain: {str(e)}")
        raise

def fetch_transactions_for_user(user_address: str):
    """
    Fetch all blockchain transactions related to a user.
    
    Args:
        user_address: Blockchain address of the user
        
    Returns:
        List of transaction dictionaries
    """
    try:
        user_address = Web3.to_checksum_address(user_address)
        transactions = []
        
        # Get transactions from blockchain
        for block_number in range(web3.eth.block_number + 1):
            block = web3.eth.get_block(block_number, full_transactions=True)
            for tx in block.transactions:
                if tx['from'] == user_address or tx['to'] == user_address:
                    transactions.append({
                        "blockNumber": tx['blockNumber'],
                        "transactionHash": tx['hash'].hex(),
                        "from": tx['from'],
                        "to": tx['to'],
                        "value": tx['value'],
                        "gas": tx['gas'],
                        "gasPrice": tx['gasPrice']
                    })
        
        logger.info(f"Fetched {len(transactions)} transactions for user {user_address}")
        return transactions
    except Exception as e:
        logger.error(f"Error fetching transactions for user: {str(e)}")
        raise

def get_all_file_hashes(user_address: str):
    """
    Get all file hashes stored on the blockchain for a user.
    
    Args:
        user_address: Blockchain address of the user
        
    Returns:
        Tuple containing lists of file hashes, file names, and timestamps
    """
    try:
        user_address = Web3.to_checksum_address(user_address)
        file_hashes, file_names, time_stamps = contract.functions.getAllFileHashes().call({"from": user_address})
        logger.info(f"Retrieved {len(file_hashes)} file hashes for user {user_address}")
        return file_hashes, file_names, time_stamps
    except Exception as e:
        logger.error(f"Error getting all file hashes: {str(e)}")
        raise

def interact_with_contract(function_name: str, *args, sender_address: str = None):
    """
    Dynamically call a smart contract function.
    
    Args:
        function_name: Name of the contract function to call
        *args: Arguments to pass to the contract function
        sender_address: Address of the transaction sender (optional)
        
    Returns:
        Result from the contract function call
    """
    try:
        # Dynamically call the smart contract function by name
        contract_function = getattr(contract.functions, function_name)
        
        # If sender address is provided, call with transaction context
        if sender_address:
            sender_address = Web3.to_checksum_address(sender_address)
            result = contract_function(*args).call({"from": sender_address})
        else:
            result = contract_function(*args).call()
            
        logger.info(f"Called contract function {function_name}")
        return result
    except Exception as e:
        logger.error(f"Error interacting with contract function {function_name}: {str(e)}")
        raise

def delete_file(ipfs_hash: str, user_address: str):
    """
    Delete a file reference from the blockchain.
    
    Args:
        ipfs_hash: IPFS hash of the file to delete
        user_address: Blockchain address of the user
        
    Returns:
        Transaction hash of the deletion operation
    """
    try:
        user_address = Web3.to_checksum_address(user_address)
        tx_hash = contract.functions.deleteFile(ipfs_hash).transact({"from": user_address})
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        logger.info(f"Deleted file with hash {ipfs_hash} from blockchain")
        return tx_receipt['transactionHash'].hex()
    except Exception as e:
        logger.error(f"Error deleting file from blockchain: {str(e)}")
        raise

def update_file_metadata(ipfs_hash: str, new_metadata: str, user_address: str):
    """
    Update metadata for a file on the blockchain.
    
    Args:
        ipfs_hash: IPFS hash of the file
        new_metadata: Updated metadata
        user_address: Blockchain address of the user
        
    Returns:
        Transaction hash of the update operation
    """
    try:
        user_address = Web3.to_checksum_address(user_address)
        tx_hash = contract.functions.updateFileMetadata(ipfs_hash, new_metadata).transact({"from": user_address})
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        logger.info(f"Updated metadata for file with hash {ipfs_hash}")
        return tx_receipt['transactionHash'].hex()
    except Exception as e:
        logger.error(f"Error updating file metadata: {str(e)}")
        raise

def verify_file_on_blockchain(ipfs_hash: str):
    """
    Verify if a file exists on the blockchain.
    
    Args:
        ipfs_hash: IPFS hash of the file to verify
        
    Returns:
        Boolean indicating if the file exists
    """
    try:
        verification_status = contract.functions.verifyFile(ipfs_hash).call()
        logger.info(f"Verified file with hash {ipfs_hash}, status: {verification_status}")
        return verification_status
    except Exception as e:
        logger.error(f"Error verifying file on blockchain: {str(e)}")
        raise

def get_file_metadata(ipfs_hash: str, user_address: str):
    """
    Get metadata for a file from the blockchain.
    
    Args:
        ipfs_hash: IPFS hash of the file
        user_address: Blockchain address of the user
        
    Returns:
        Dictionary with file metadata
    """
    try:
        user_address = Web3.to_checksum_address(user_address)
        metadata = contract.functions.getFileMetadata(ipfs_hash).call({"from": user_address})
        logger.info(f"Retrieved metadata for file with hash {ipfs_hash}")
        return {
            "fileName": metadata[0],
            "timestamp": metadata[1],
            "owner": metadata[2]
        }
    except Exception as e:
        logger.error(f"Error getting file metadata: {str(e)}")
        raise

def get_transaction_details(transaction_hash: str, user_address: str):
    """
    Get details of a blockchain transaction.
    
    Args:
        transaction_hash: Hash of the transaction
        user_address: Blockchain address of the user
        
    Returns:
        Dictionary with transaction details
    """
    try:
        user_address = Web3.to_checksum_address(user_address)
        details = contract.functions.getTransactionDetails(transaction_hash).call({"from": user_address})
        logger.info(f"Retrieved details for transaction {transaction_hash}")
        return {
            "fileHash": details[0],
            "uploader": details[1],
            "timestamp": details[2]
        }
    except Exception as e:
        logger.error(f"Error getting transaction details: {str(e)}")
        raise
