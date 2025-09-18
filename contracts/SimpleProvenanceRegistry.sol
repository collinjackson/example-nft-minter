// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleProvenanceRegistry
 * @dev Minimal registry for image provenance - stores only essential hashes
 * @notice This contract stores minimal data on-chain, verification happens client-side
 */
contract SimpleProvenanceRegistry {
    
    // Struct to store minimal provenance data
    struct ProvenanceRecord {
        bytes32 imageHash;         // Hash of the image
        bytes32 manifestHash;     // Hash of C2PA manifest  
        bytes32 proofHash;         // Hash of zero-knowledge proof
        address submitter;         // Address of the submitter
        uint256 timestamp;        // Registration timestamp
        uint256 popularityScore;  // Community popularity score
    }

    // Mapping from proof hash to provenance record
    mapping(bytes32 => ProvenanceRecord) public records;
    
    // Array of all registered proof hashes
    bytes32[] public allProofHashes;
    
    // Mapping from submitter to their proof hashes
    mapping(address => bytes32[]) public submitterToProofs;
    
    // Events
    event ProvenanceRegistered(
        bytes32 indexed proofHash,
        bytes32 indexed imageHash,
        address indexed submitter,
        uint256 timestamp
    );
    
    event PopularityVoted(
        bytes32 indexed proofHash,
        address indexed voter,
        uint256 newScore
    );

    /**
     * @dev Register a new provenance record
     * @param imageHash Hash of the image
     * @param manifestHash Hash of C2PA manifest
     * @param proofHash Hash of zero-knowledge proof
     */
    function registerProvenance(
        bytes32 imageHash,
        bytes32 manifestHash,
        bytes32 proofHash
    ) external {
        // Check if proof hash already exists
        require(records[proofHash].timestamp == 0, "Proof hash already registered");
        
        // Create record
        records[proofHash] = ProvenanceRecord({
            imageHash: imageHash,
            manifestHash: manifestHash,
            proofHash: proofHash,
            submitter: msg.sender,
            timestamp: block.timestamp,
            popularityScore: 0
        });
        
        // Update mappings
        allProofHashes.push(proofHash);
        submitterToProofs[msg.sender].push(proofHash);
        
        emit ProvenanceRegistered(proofHash, imageHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Vote on popularity of a proof
     * @param proofHash Hash of the proof to vote on
     */
    function votePopularity(bytes32 proofHash) external {
        require(records[proofHash].timestamp > 0, "Proof hash not found");
        
        records[proofHash].popularityScore++;
        
        emit PopularityVoted(proofHash, msg.sender, records[proofHash].popularityScore);
    }

    /**
     * @dev Get provenance record for a proof hash
     * @param proofHash Hash of the proof
     * @return ProvenanceRecord struct
     */
    function getRecord(bytes32 proofHash) external view returns (ProvenanceRecord memory) {
        require(records[proofHash].timestamp > 0, "Proof hash not found");
        return records[proofHash];
    }

    /**
     * @dev Get all proof hashes
     * @return Array of all proof hashes
     */
    function getAllProofHashes() external view returns (bytes32[] memory) {
        return allProofHashes;
    }

    /**
     * @dev Get proof hashes submitted by an address
     * @param submitter Address of the submitter
     * @return Array of proof hashes submitted by the address
     */
    function getProofsBySubmitter(address submitter) external view returns (bytes32[] memory) {
        return submitterToProofs[submitter];
    }

    /**
     * @dev Get total number of registered proofs
     * @return Total count
     */
    function getTotalProofs() external view returns (uint256) {
        return allProofHashes.length;
    }

    /**
     * @dev Get top popular proofs
     * @param limit Number of top proofs to return
     * @return Array of proof hashes sorted by popularity
     */
    function getTopProofs(uint256 limit) external view returns (bytes32[] memory) {
        if (allProofHashes.length == 0) return new bytes32[](0);
        
        // Create array of proof hashes with their popularity scores
        bytes32[][] memory proofScores = new bytes32[][](allProofHashes.length);
        for (uint256 i = 0; i < allProofHashes.length; i++) {
            proofScores[i] = new bytes32[](2);
            proofScores[i][0] = allProofHashes[i];
            proofScores[i][1] = bytes32(records[allProofHashes[i]].popularityScore);
        }
        
        // Simple bubble sort (for small arrays)
        for (uint256 i = 0; i < proofScores.length - 1; i++) {
            for (uint256 j = 0; j < proofScores.length - i - 1; j++) {
                if (records[proofScores[j][0]].popularityScore < records[proofScores[j + 1][0]].popularityScore) {
                    bytes32[] memory temp = proofScores[j];
                    proofScores[j] = proofScores[j + 1];
                    proofScores[j + 1] = temp;
                }
            }
        }
        
        // Return top N proofs
        uint256 resultLength = limit < allProofHashes.length ? limit : allProofHashes.length;
        bytes32[] memory result = new bytes32[](resultLength);
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = proofScores[i][0];
        }
        
        return result;
    }
}
