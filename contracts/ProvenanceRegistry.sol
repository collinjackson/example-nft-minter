// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ProvenanceRegistry
 * @dev Registry contract for tracking verified image provenance NFTs
 * @notice This contract maintains a registry of NFTs with embedded provenance proofs
 *         Users mint their own NFTs and register them here for community verification
 */
contract ProvenanceRegistry is Ownable {
    using Strings for uint256;

    // Struct to store provenance verification data
    struct ProvenanceVerification {
        address nftContract;       // Address of the NFT contract
        uint256 tokenId;          // Token ID of the NFT
        string zkProofHash;       // Hash of the zero-knowledge proof
        string c2paManifestHash;  // Hash of C2PA manifest
        string category;          // Image category
        address submitter;        // Address of the submitter
        uint256 timestamp;        // Registration timestamp
        bool verified;            // Community verification status
        uint256 verificationScore; // Community verification score
        uint256 popularityScore;  // Community popularity score
    }

    // Mapping from proof hash to verification data
    mapping(string => ProvenanceVerification) public verifications;
    
    // Mapping from NFT contract+tokenId to proof hash
    mapping(address => mapping(uint256 => string)) public nftToProofHash;
    
    // Array of all registered proof hashes
    string[] public allProofHashes;
    
    // Mapping from category to proof hashes
    mapping(string => string[]) public categoryToProofs;
    
    // Mapping from submitter to their proof hashes
    mapping(address => string[]) public submitterToProofs;
    
    // Community voting for verification
    mapping(string => mapping(address => bool)) public hasVoted;
    mapping(string => uint256) public verificationVotes;
    mapping(string => uint256) public popularityVotes;
    
    // Verification threshold
    uint256 public verificationThreshold = 5;
    
    // Events
    event NFTRegistered(
        string indexed proofHash,
        address indexed nftContract,
        uint256 indexed tokenId,
        address submitter,
        string category
    );
    
    event VerificationVoted(
        string indexed proofHash,
        address indexed voter,
        bool verified,
        uint256 newScore
    );
    
    event PopularityVoted(
        string indexed proofHash,
        address indexed voter,
        uint256 newScore
    );
    
    event NFTVerified(string indexed proofHash, bool verified);
    
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Register an NFT with provenance proof
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID of the NFT
     * @param zkProofHash Hash of the zero-knowledge proof
     * @param c2paManifestHash Hash of C2PA manifest
     * @param category Image category
     */
    function registerNFT(
        address nftContract,
        uint256 tokenId,
        string memory zkProofHash,
        string memory c2paManifestHash,
        string memory category
    ) external {
        // Verify the caller owns the NFT
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        
        // Check if proof hash already exists
        require(bytes(verifications[zkProofHash].zkProofHash).length == 0, "Proof hash already registered");
        
        // Check if NFT already registered
        require(bytes(nftToProofHash[nftContract][tokenId]).length == 0, "NFT already registered");
        
        // Create verification record
        verifications[zkProofHash] = ProvenanceVerification({
            nftContract: nftContract,
            tokenId: tokenId,
            zkProofHash: zkProofHash,
            c2paManifestHash: c2paManifestHash,
            category: category,
            submitter: msg.sender,
            timestamp: block.timestamp,
            verified: false,
            verificationScore: 0,
            popularityScore: 0
        });
        
        // Update mappings
        nftToProofHash[nftContract][tokenId] = zkProofHash;
        allProofHashes.push(zkProofHash);
        categoryToProofs[category].push(zkProofHash);
        submitterToProofs[msg.sender].push(zkProofHash);
        
        emit NFTRegistered(zkProofHash, nftContract, tokenId, msg.sender, category);
    }

    /**
     * @dev Vote on verification status of a proof
     * @param proofHash Hash of the proof to vote on
     * @param verified Whether the proof is verified
     */
    function voteVerification(string memory proofHash, bool verified) external {
        require(bytes(verifications[proofHash].zkProofHash).length > 0, "Proof hash not found");
        require(!hasVoted[proofHash][msg.sender], "Already voted");
        
        hasVoted[proofHash][msg.sender] = true;
        
        if (verified) {
            verificationVotes[proofHash]++;
        }
        
        uint256 newScore = verificationVotes[proofHash];
        verifications[proofHash].verificationScore = newScore;
        
        // Auto-verify if threshold reached
        if (newScore >= verificationThreshold && !verifications[proofHash].verified) {
            verifications[proofHash].verified = true;
            emit NFTVerified(proofHash, true);
        }
        
        emit VerificationVoted(proofHash, msg.sender, verified, newScore);
    }

    /**
     * @dev Vote on popularity of a proof
     * @param proofHash Hash of the proof to vote on
     */
    function votePopularity(string memory proofHash) external {
        require(bytes(verifications[proofHash].zkProofHash).length > 0, "Proof hash not found");
        
        popularityVotes[proofHash]++;
        verifications[proofHash].popularityScore = popularityVotes[proofHash];
        
        emit PopularityVoted(proofHash, msg.sender, popularityVotes[proofHash]);
    }

    /**
     * @dev Get verification data for a proof hash
     * @param proofHash Hash of the proof
     * @return ProvenanceVerification struct
     */
    function getVerification(string memory proofHash) external view returns (ProvenanceVerification memory) {
        require(bytes(verifications[proofHash].zkProofHash).length > 0, "Proof hash not found");
        return verifications[proofHash];
    }

    /**
     * @dev Get all proof hashes
     * @return Array of all proof hashes
     */
    function getAllProofHashes() external view returns (string[] memory) {
        return allProofHashes;
    }

    /**
     * @dev Get proof hashes by category
     * @param category Category name
     * @return Array of proof hashes in category
     */
    function getProofHashesByCategory(string memory category) external view returns (string[] memory) {
        return categoryToProofs[category];
    }

    /**
     * @dev Get verified proof hashes by category
     * @param category Category name
     * @return Array of verified proof hashes in category
     */
    function getVerifiedProofHashesByCategory(string memory category) external view returns (string[] memory) {
        string[] memory categoryProofs = categoryToProofs[category];
        string[] memory verifiedProofs = new string[](categoryProofs.length);
        uint256 verifiedCount = 0;
        
        for (uint256 i = 0; i < categoryProofs.length; i++) {
            if (verifications[categoryProofs[i]].verified) {
                verifiedProofs[verifiedCount] = categoryProofs[i];
                verifiedCount++;
            }
        }
        
        // Resize array to actual verified count
        string[] memory result = new string[](verifiedCount);
        for (uint256 i = 0; i < verifiedCount; i++) {
            result[i] = verifiedProofs[i];
        }
        
        return result;
    }

    /**
     * @dev Get top popular proofs by category
     * @param category Category name
     * @param limit Number of top proofs to return
     * @return Array of proof hashes sorted by popularity
     */
    function getTopProofsByCategory(string memory category, uint256 limit) external view returns (string[] memory) {
        string[] memory categoryProofs = categoryToProofs[category];
        if (categoryProofs.length == 0) return new string[](0);
        
        // Create array of proof hashes with their popularity scores
        string[][] memory proofScores = new string[][](categoryProofs.length);
        for (uint256 i = 0; i < categoryProofs.length; i++) {
            proofScores[i] = new string[](2);
            proofScores[i][0] = categoryProofs[i];
            proofScores[i][1] = verifications[categoryProofs[i]].popularityScore.toString();
        }
        
        // Simple bubble sort (for small arrays)
        for (uint256 i = 0; i < proofScores.length - 1; i++) {
            for (uint256 j = 0; j < proofScores.length - i - 1; j++) {
                if (verifications[proofScores[j][0]].popularityScore < verifications[proofScores[j + 1][0]].popularityScore) {
                    string[] memory temp = proofScores[j];
                    proofScores[j] = proofScores[j + 1];
                    proofScores[j + 1] = temp;
                }
            }
        }
        
        // Return top N proofs
        uint256 resultLength = limit < categoryProofs.length ? limit : categoryProofs.length;
        string[] memory result = new string[](resultLength);
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = proofScores[i][0];
        }
        
        return result;
    }

    /**
     * @dev Get proofs submitted by an address
     * @param submitter Address of the submitter
     * @return Array of proof hashes submitted by the address
     */
    function getProofsBySubmitter(address submitter) external view returns (string[] memory) {
        return submitterToProofs[submitter];
    }

    /**
     * @dev Set verification threshold
     * @param _threshold New verification threshold
     */
    function setVerificationThreshold(uint256 _threshold) external onlyOwner {
        verificationThreshold = _threshold;
    }

    /**
     * @dev Get total number of registered proofs
     * @return Total count
     */
    function getTotalProofs() external view returns (uint256) {
        return allProofHashes.length;
    }

    /**
     * @dev Get total number of verified proofs
     * @return Total verified count
     */
    function getTotalVerifiedProofs() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < allProofHashes.length; i++) {
            if (verifications[allProofHashes[i]].verified) {
                count++;
            }
        }
        return count;
    }
}

// Interface for ERC721
interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
}
