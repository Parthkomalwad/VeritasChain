"""
Pydantic schemas for file operations.
"""
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime

class FileUploadResponse(BaseModel):
    """Response model for file upload operations."""
    message: str = Field(..., description="Status message")
    ipfs_hash: str = Field(..., description="IPFS hash of the uploaded file")
    transaction_receipt: Dict = Field(..., description="Blockchain transaction receipt")

class FileVerifyResponse(BaseModel):
    """Response model for file verification operations."""
    file_exists: bool = Field(..., description="Whether the file exists on IPFS")

class TransactionResponse(BaseModel):
    """Response model for transaction operations."""
    transactions: List[Dict] = Field(..., description="List of transactions")

class IPFSDataResponse(BaseModel):
    """Response model for IPFS data retrieval."""
    data: str = Field(..., description="Data retrieved from IPFS")

class FileHashResponse(BaseModel):
    """Response model for file hash operations."""
    file_hash: str = Field(..., description="IPFS hash of the file")

class AllFileHashesResponse(BaseModel):
    """Response model for retrieving all file hashes."""
    file_hashes: Dict[str, Dict[str, str]] = Field(
        ..., 
        description="Dictionary mapping file names to their hashes and timestamps"
    )

class BlockchainStatsResponse(BaseModel):
    """Response model for blockchain statistics."""
    blockchain_stats: Dict = Field(..., description="Blockchain statistics")

class UserBalanceResponse(BaseModel):
    """Response model for user balance."""
    balance: float = Field(..., description="User's balance in ETH")

class FileMetadataResponse(BaseModel):
    """Response model for file metadata."""
    metadata: Dict = Field(..., description="File metadata")

class TransactionDetailsResponse(BaseModel):
    """Response model for transaction details."""
    transaction_details: Dict = Field(..., description="Transaction details")

class SearchFilesResponse(BaseModel):
    """Response model for file search operations."""
    matching_files: Dict = Field(..., description="Matching files")
