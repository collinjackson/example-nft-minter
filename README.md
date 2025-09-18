# Verifiable Image Provenance System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is an open, verifiable image provenance system leveraging [Nexus zkVM](https://nexus.xyz) for zero-knowledge proof generation. Creators submit compressed image URLs along with cryptographic proofs of their C2PA manifests and hashes, generated client-side using Nexus zkVM, proving content authenticity without revealing raw originals.

---

## Project Overview

### Core Concept
The system creates a transparent, decentralized-like audit log of image submissions without hosting image bytes, avoiding moderation overhead. Approved submissions merge into a public gallery showcasing images arranged by categories like live camera feed or AI-generated artwork, with leaderboards tracking popularity.

### Key Features
- **Zero-Knowledge Proof Generation**: Client-side proof generation using Nexus zkVM
- **C2PA Manifest Verification**: Cryptographic proofs of content authenticity
- **Automated Verification**: Server-side Firebase Cloud Functions + GitHub Actions workflows
- **Public Gallery**: Categorized image display with community-driven curation
- **Incentivized Participation**: Nexus testnet rewards and NFT grants
- **Privacy-Preserving**: Verifies authenticity without exposing original content

---

## Architecture

### 1. Client-Side Components
- **Image Submission Interface**: Upload images with automatic C2PA manifest generation
- **Zero-Knowledge Proof Generation**: Nexus zkVM integration for proof creation
- **Wallet Integration**: Nexus testnet connectivity for rewards

### 2. Verification Layer
- **GitHub Actions**: Comprehensive automated workflows for verification
- **Community Voting**: Transparent voting system for final approval
- **Smart Contracts**: NFT minting and reward distribution on Nexus testnet

### 3. Community Features
- **Public Gallery**: Categorized image showcase
- **Leaderboards**: Popularity tracking and community engagement
- **Reward System**: Token/NFT grants for verified contributions

---

## Getting Started

### 🚀 One-Click Setup

```bash
git clone git@github.com:collinjackson/example-nft-minter.git
cd example-nft-minter
./setup.sh
```

### Prerequisites
- Node.js 18+
- [pnpm](https://pnpm.io/) or npm
- Nexus testnet wallet with funds
- GitHub account for forking

### Manual Installation (Alternative)

```bash
git clone git@github.com:collinjackson/example-nft-minter.git
cd example-nft-minter
npm install
cd frontend && npm install
```

### 2. Environment Setup

Create `.env` in the root directory:
```bash
# Nexus testnet configuration
NEXUS_RPC_URL=https://testnet3.rpc.nexus.xyz
PRIVATE_KEY=your_private_key_for_deployment

# Application URLs
NEXT_PUBLIC_URL=http://localhost:3000
```

Create `frontend/.env.local`:
```bash
# Smart contract addresses
NEXT_PUBLIC_PROVENANCE_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=your_reward_contract_address

# Nexus zkVM configuration
NEXT_PUBLIC_NEXUS_ZKVM_URL=https://zkvm.testnet.nexus.xyz
```

### 3. Smart Contract Deployment

```bash
# Compile contracts
npx hardhat compile

# Deploy provenance contract
npx hardhat run scripts/deploy-provenance.js --network nexus-testnet

# Deploy reward contract
npx hardhat run scripts/deploy-rewards.js --network nexus-testnet

# Copy ABIs to frontend
node copy-abi.js
```

### 4. Firebase Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init functions

# Deploy Cloud Functions
firebase deploy --only functions
```

### 5. GitHub Actions Setup

Create `.github/workflows/verify-submission.yml` for automated verification workflows.

### 6. Run the Application

```bash
cd frontend
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to access the image provenance system.

---

## Project Structure

```
verifiable-image-provenance/
├── contracts/                 # Smart contracts
│   ├── ProvenanceNFT.sol     # Main provenance contract
│   └── RewardToken.sol       # Reward distribution contract
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities and integrations
│   │   ├── hooks/           # Custom React hooks
│   │   └── app/             # Next.js app router
│   └── abi/                 # Contract ABIs
├── functions/               # Firebase Cloud Functions
├── .github/workflows/       # GitHub Actions
├── scripts/                 # Deployment scripts
└── docs/                    # Documentation
```

---

## Key Technologies

- **Nexus zkVM**: Zero-knowledge proof generation
- **C2PA**: Content provenance and authenticity
- **Next.js**: Frontend framework
- **Firebase**: Backend services and verification
- **GitHub Actions**: Automated workflows
- **Solidity**: Smart contracts on Nexus testnet
- **TypeScript**: Type-safe development

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit images with C2PA proofs via pull request
4. Automated verification will validate your submission
5. Approved submissions merge into the public gallery

