// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract UserFileStorage {
    struct File {
        string fileHash; // IPFS hash
        string fileName;
        uint256 timestamp;
    }

    // Use a count to keep track of files per user
    mapping(address => uint256) private userFileCount;
    // Map user address and file index to file
    mapping(address => mapping(uint256 => File)) private userFiles;

    // Global mapping: transaction hash => IPFS hash
    mapping(string => string) private transactionToFileHash;

    // User-based mapping: user => (transaction hash => IPFS hash)
    mapping(address => mapping(string => string))
        private userTransactionToFileHash;

    // Upload a file
    function uploadFile(string memory fileHash, string memory fileName) public {
        uint256 currentCount = userFileCount[msg.sender];
        userFiles[msg.sender][currentCount] = File(
            fileHash,
            fileName,
            block.timestamp
        );
        userFileCount[msg.sender] = currentCount + 1;
    }

    // Map transaction hash to IPFS hash globally and for the user
    function mapTransactionToIPFS(
        string memory transactionHash,
        string memory fileHash
    ) public {
        require(bytes(fileHash).length > 0, "File hash cannot be empty");
        require(
            bytes(transactionToFileHash[transactionHash]).length == 0,
            "Transaction hash already mapped"
        );

        transactionToFileHash[transactionHash] = fileHash;
        userTransactionToFileHash[msg.sender][transactionHash] = fileHash;
    }

    // Get total count of user files
    function getUserFileCount() public view returns (uint256) {
        return userFileCount[msg.sender];
    }

    // Get a specific file by index
    function getUserFile(
        uint256 index
    ) public view returns (string memory, string memory, uint256) {
        require(index < userFileCount[msg.sender], "File index out of bounds");
        File memory file = userFiles[msg.sender][index];
        return (file.fileHash, file.fileName, file.timestamp);
    }

    // Retrieve file hash by transaction hash (global)
    function getFileHashByTransaction(
        string memory transactionHash
    ) public view returns (string memory) {
        require(
            bytes(transactionToFileHash[transactionHash]).length > 0,
            "Transaction hash not found"
        );
        return transactionToFileHash[transactionHash];
    }

    // Retrieve file hash by transaction hash for sender
    function getUserFileHashByTransaction(
        string memory transactionHash
    ) public view returns (string memory) {
        require(
            bytes(userTransactionToFileHash[msg.sender][transactionHash])
                .length > 0,
            "Transaction hash not found for user"
        );
        return userTransactionToFileHash[msg.sender][transactionHash];
    }

    // Retrieve all file hashes for the sender
    function getAllFileHashes()
        public
        view
        returns (string[] memory, string[] memory, uint256[] memory)
    {
        uint256 fileCount = userFileCount[msg.sender];
        string[] memory fileHashes = new string[](fileCount);
        string[] memory fileNames = new string[](fileCount);
        uint256[] memory timestamps = new uint256[](fileCount);

        for (uint256 i = 0; i < fileCount; i++) {
            fileHashes[i] = userFiles[msg.sender][i].fileHash;
            fileNames[i] = userFiles[msg.sender][i].fileName;
            timestamps[i] = userFiles[msg.sender][i].timestamp;
        }

        return (fileHashes, fileNames, timestamps);
    }

    // Delete a file by its IPFS hash
    function deleteFile(string memory fileHash) public {
        uint256 fileCount = userFileCount[msg.sender];
        bool fileFound = false;

        for (uint256 i = 0; i < fileCount; i++) {
            if (
                keccak256(
                    abi.encodePacked(userFiles[msg.sender][i].fileHash)
                ) == keccak256(abi.encodePacked(fileHash))
            ) {
                fileFound = true;
                // Shift the remaining files to fill the gap
                for (uint256 j = i; j < fileCount - 1; j++) {
                    userFiles[msg.sender][j] = userFiles[msg.sender][j + 1];
                }
                delete userFiles[msg.sender][fileCount - 1];
                userFileCount[msg.sender]--;
                break;
            }
        }

        require(fileFound, "File not found");
    }

    // Update metadata for a file by its IPFS hash
    function updateFileMetadata(
        string memory fileHash,
        string memory newFileName
    ) public {
        uint256 fileCount = userFileCount[msg.sender];
        bool fileFound = false;

        for (uint256 i = 0; i < fileCount; i++) {
            if (
                keccak256(
                    abi.encodePacked(userFiles[msg.sender][i].fileHash)
                ) == keccak256(abi.encodePacked(fileHash))
            ) {
                userFiles[msg.sender][i].fileName = newFileName;
                fileFound = true;
                break;
            }
        }

        require(fileFound, "File not found");
    }

    // Verify if a file exists on the blockchain by its IPFS hash
    function verifyFile(string memory fileHash) public view returns (bool) {
        uint256 fileCount = userFileCount[msg.sender];

        for (uint256 i = 0; i < fileCount; i++) {
            if (
                keccak256(
                    abi.encodePacked(userFiles[msg.sender][i].fileHash)
                ) == keccak256(abi.encodePacked(fileHash))
            ) {
                return true;
            }
        }

        return false;
    }

    // Get detailed metadata for a file
    function getFileMetadata(
        string memory fileHash
    )
        public
        view
        returns (string memory fileName, uint256 timestamp, address owner)
    {
        uint256 fileCount = userFileCount[msg.sender];
        for (uint256 i = 0; i < fileCount; i++) {
            if (
                keccak256(
                    abi.encodePacked(userFiles[msg.sender][i].fileHash)
                ) == keccak256(abi.encodePacked(fileHash))
            ) {
                return (
                    userFiles[msg.sender][i].fileName,
                    userFiles[msg.sender][i].timestamp,
                    msg.sender
                );
            }
        }
        revert("File not found");
    }

    // Get transaction details
    function getTransactionDetails(
        string memory transactionHash
    )
        public
        view
        returns (string memory fileHash, address uploader, uint256 timestamp)
    {
        string memory associatedFileHash = transactionToFileHash[
            transactionHash
        ];
        require(bytes(associatedFileHash).length > 0, "Transaction not found");

        uint256 fileCount = userFileCount[msg.sender];
        for (uint256 i = 0; i < fileCount; i++) {
            if (
                keccak256(
                    abi.encodePacked(userFiles[msg.sender][i].fileHash)
                ) == keccak256(abi.encodePacked(associatedFileHash))
            ) {
                return (
                    associatedFileHash,
                    msg.sender,
                    userFiles[msg.sender][i].timestamp
                );
            }
        }
        revert("File details not found");
    }

    // Search files by name pattern
    function searchFiles(
        address userAddress,
        string memory searchPattern
    )
        public
        view
        returns (string[] memory fileHashes, string[] memory fileNames)
    {
        uint256 matchCount = 0;
        uint256 fileCount = userFileCount[userAddress];

        // First count matches
        for (uint256 i = 0; i < fileCount; i++) {
            if (contains(userFiles[userAddress][i].fileName, searchPattern)) {
                matchCount++;
            }
        }

        // Initialize arrays with correct size
        fileHashes = new string[](matchCount);
        fileNames = new string[](matchCount);

        // Fill arrays with matching files
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < fileCount && currentIndex < matchCount; i++) {
            if (contains(userFiles[userAddress][i].fileName, searchPattern)) {
                fileHashes[currentIndex] = userFiles[userAddress][i].fileHash;
                fileNames[currentIndex] = userFiles[userAddress][i].fileName;
                currentIndex++;
            }
        }

        return (fileHashes, fileNames);
    }

    // Helper function to check if a string contains a pattern
    function contains(
        string memory source,
        string memory pattern
    ) internal pure returns (bool) {
        bytes memory sourceBytes = bytes(source);
        bytes memory patternBytes = bytes(pattern);

        if (patternBytes.length == 0) {
            return true;
        }

        if (sourceBytes.length < patternBytes.length) {
            return false;
        }

        for (uint i = 0; i <= sourceBytes.length - patternBytes.length; i++) {
            bool found = true;
            for (uint j = 0; j < patternBytes.length; j++) {
                if (sourceBytes[i + j] != patternBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return true;
            }
        }
        return false;
    }
}
