// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ProvenanceNFT
 * @dev Simple NFT contract for users to mint their own provenance NFTs
 * @notice Users deploy this contract and mint NFTs with embedded provenance proofs
 */
contract ProvenanceNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    // Struct to store provenance data
    struct ProvenanceData {
        string imageUrl;           // Compressed image URL
        string c2paManifestHash;   // Hash of C2PA manifest
        string zkProofHash;        // Hash of zero-knowledge proof
        string category;           // Image category
        uint256 timestamp;        // Mint timestamp
        bool isRegistered;        // Whether registered in ProvenanceRegistry
    }

    // Mapping from token ID to provenance data
    mapping(uint256 => ProvenanceData) public provenanceData;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Token ID counter
    uint256 private _nextTokenId = 1;
    
    // Provenance registry contract address
    address public provenanceRegistry;
    
    // Events
    event ProvenanceNFTMinted(
        uint256 indexed tokenId,
        address indexed minter,
        string imageUrl,
        string category
    );
    
    event ProvenanceDataUpdated(
        uint256 indexed tokenId,
        string zkProofHash,
        string c2paManifestHash
    );

    constructor(
        string memory name,
        string memory symbol,
        string memory initialBaseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = initialBaseURI;
    }

    /**
     * @dev Mint a new provenance NFT
     * @param imageUrl Compressed image URL
     * @param c2paManifestHash Hash of C2PA manifest
     * @param zkProofHash Hash of zero-knowledge proof
     * @param category Image category
     */
    function mintProvenanceNFT(
        string memory imageUrl,
        string memory c2paManifestHash,
        string memory zkProofHash,
        string memory category
    ) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        // Store provenance data
        provenanceData[tokenId] = ProvenanceData({
            imageUrl: imageUrl,
            c2paManifestHash: c2paManifestHash,
            zkProofHash: zkProofHash,
            category: category,
            timestamp: block.timestamp,
            isRegistered: false
        });
        
        // Mint NFT to caller
        _safeMint(msg.sender, tokenId);
        
        emit ProvenanceNFTMinted(tokenId, msg.sender, imageUrl, category);
        
        return tokenId;
    }

    /**
     * @dev Update provenance data (only token owner)
     * @param tokenId Token ID
     * @param c2paManifestHash New C2PA manifest hash
     * @param zkProofHash New zero-knowledge proof hash
     */
    function updateProvenanceData(
        uint256 tokenId,
        string memory c2paManifestHash,
        string memory zkProofHash
    ) external {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        provenanceData[tokenId].c2paManifestHash = c2paManifestHash;
        provenanceData[tokenId].zkProofHash = zkProofHash;
        provenanceData[tokenId].isRegistered = false; // Reset registration status
        
        emit ProvenanceDataUpdated(tokenId, zkProofHash, c2paManifestHash);
    }

    /**
     * @dev Register this NFT in the provenance registry
     * @param tokenId Token ID to register
     */
    function registerInProvenanceRegistry(uint256 tokenId) external {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(provenanceRegistry != address(0), "Registry not set");
        require(!provenanceData[tokenId].isRegistered, "Already registered");
        
        ProvenanceData memory data = provenanceData[tokenId];
        
        // Call registry contract
        IProvenanceRegistry registry = IProvenanceRegistry(provenanceRegistry);
        registry.registerNFT(
            address(this),
            tokenId,
            data.zkProofHash,
            data.c2paManifestHash,
            data.category
        );
        
        provenanceData[tokenId].isRegistered = true;
    }

    /**
     * @dev Set provenance registry address
     * @param _registry Address of the provenance registry
     */
    function setProvenanceRegistry(address _registry) external onlyOwner {
        provenanceRegistry = _registry;
    }

    /**
     * @dev Get provenance data for a token
     * @param tokenId Token ID
     * @return ProvenanceData struct
     */
    function getProvenanceData(uint256 tokenId) external view returns (ProvenanceData memory) {
        require(_exists(tokenId), "Token does not exist");
        return provenanceData[tokenId];
    }

    /**
     * @dev Override baseURI function
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Set base URI for metadata
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    /**
     * @dev Get token URI for metadata
     * @param tokenId Token ID
     * @return Token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 
            ? string(abi.encodePacked(baseURI, tokenId.toString()))
            : "";
    }

    /**
     * @dev Get all tokens owned by an address
     * @param owner Address of the owner
     * @return Array of token IDs
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 count = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
    }
}

// Interface for ProvenanceRegistry
interface IProvenanceRegistry {
    function registerNFT(
        address nftContract,
        uint256 tokenId,
        string memory zkProofHash,
        string memory c2paManifestHash,
        string memory category
    ) external;
}