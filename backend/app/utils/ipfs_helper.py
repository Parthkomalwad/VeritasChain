"""
Utility functions for IPFS interactions.
"""
import requests
from app.core.config import settings
from app.utils.logger import setup_logger

logger = setup_logger("ipfs_helper")

def upload_to_ipfs(file_path: str) -> str:
    """
    Upload a file to IPFS.
    
    Args:
        file_path: Path to the file to upload
        
    Returns:
        IPFS hash of the uploaded file
    """
    try:
        url = f"{settings.IPFS_CLIENT}/api/v0/add"
        with open(file_path, 'rb') as file:
            files = {'file': file}
            response = requests.post(url, files=files)
            if response.status_code == 200:
                ipfs_hash = response.json()['Hash']
                logger.info(f"Successfully uploaded file to IPFS with hash: {ipfs_hash}")
                return ipfs_hash
            else:
                logger.error(f"Failed to upload to IPFS. Status code: {response.status_code}")
                raise Exception(f"Failed to upload to IPFS: {response.text}")
    except Exception as e:
        logger.error(f"Error uploading to IPFS: {str(e)}")
        raise

def check_file_on_ipfs(file_hash: str) -> bool:
    """
    Check if a file exists on IPFS using its hash.
    
    Args:
        file_hash: IPFS hash of the file to check
        
    Returns:
        Boolean indicating if the file exists on IPFS
    """
    try:
        url = f"{settings.IPFS_CLIENT}/api/v0/ls/{file_hash}"
        response = requests.post(url)
        
        if response.status_code == 200:
            logger.info(f"File with hash {file_hash} exists on IPFS")
            return True
        elif response.status_code == 500 and "not found" in response.text.lower():
            logger.info(f"File with hash {file_hash} not found on IPFS")
            return False
        else:
            logger.warning(f"Unexpected response from IPFS: {response.status_code}")
            raise Exception(f"Unexpected response from IPFS: {response.text}")
    except Exception as e:
        logger.error(f"Error checking file on IPFS: {str(e)}")
        raise

def retrieve_ipfs_data(file_hash: str) -> str:
    """
    Retrieve data from IPFS using a file hash.
    
    Args:
        file_hash: IPFS hash of the file to retrieve
        
    Returns:
        Content of the file as text
    """
    try:
        url = f"{settings.IPFS_CLIENT}/api/v0/cat/{file_hash}"
        response = requests.post(url)
        
        if response.status_code == 200:
            logger.info(f"Successfully retrieved data for file with hash {file_hash} from IPFS")
            return response.text  # Return the file content as text
        else:
            logger.error(f"Failed to retrieve data from IPFS. Status code: {response.status_code}")
            raise Exception(f"Failed to retrieve data from IPFS: {response.text}")
    except Exception as e:
        logger.error(f"Error retrieving data from IPFS: {str(e)}")
        raise
