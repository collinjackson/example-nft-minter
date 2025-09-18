#!/bin/bash

# 🚀 One-Click Deploy Script for Verifiable Image Provenance
# This script sets up everything needed for a Vercel deployment

echo "🎯 Setting up Verifiable Image Provenance System..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd frontend && npm install && cd ..

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating environment file..."
    cat > .env << EOF
# Nexus testnet configuration
NEXUS_RPC_URL=https://testnet3.rpc.nexus.xyz
PRIVATE_KEY=your_private_key_here

# Application URLs
NEXT_PUBLIC_URL=http://localhost:3000
EOF
    echo "⚠️  Please update .env with your private key"
fi

# Create frontend environment file if it doesn't exist
if [ ! -f "frontend/.env.local" ]; then
    echo "🔧 Creating frontend environment file..."
    cat > frontend/.env.local << EOF
# Smart contract addresses (update after deployment)
NEXT_PUBLIC_PROVENANCE_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=your_reward_contract_address_here

# Nexus zkVM configuration
NEXT_PUBLIC_NEXUS_ZKVM_URL=https://zkvm.testnet.nexus.xyz
EOF
    echo "⚠️  Please update frontend/.env.local with contract addresses after deployment"
fi

# Create submissions directory
echo "📁 Creating submissions directory..."
mkdir -p submissions

# Create example submission
echo "📝 Creating example submission..."
mkdir -p submissions/example
cat > submissions/example/metadata.json << EOF
{
  "title": "Example Image",
  "description": "This is an example submission",
  "category": "photography",
  "submitter": "0x1234567890123456789012345678901234567890",
  "timestamp": $(date +%s),
  "imageHash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "manifestHash": "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3",
  "proofHash": "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4"
}
EOF

# Create example proof file
echo "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4" > submissions/example/proof.zkproof

# Create example image (placeholder)
echo "🖼️ Creating example image placeholder..."
cat > submissions/example/image.jpg << EOF
# This is a placeholder for an actual image file
# Replace this with a real image file
EOF

# Create README for submissions
cat > submissions/README.md << EOF
# 📁 Submissions Directory

This directory contains community-submitted images with their provenance proofs.

## 📋 Submission Structure

Each submission should be in its own directory with the following files:

- \`image.jpg\` (or .png, .jpeg, .webp) - The actual image file
- \`metadata.json\` - Image metadata and provenance information
- \`proof.zkproof\` - Zero-knowledge proof file

## 🔍 Example Submission

See the \`example/\` directory for a sample submission structure.

## 🚀 How to Submit

1. Create a new directory with a unique name
2. Add your image file
3. Generate C2PA manifest and zero-knowledge proof
4. Create metadata.json with all required fields
5. Submit a pull request

## ✅ Verification

All submissions are automatically verified by GitHub Actions workflows.
EOF

# Create deployment instructions
cat > DEPLOY.md << EOF
# 🚀 Deployment Instructions

## Quick Deploy to Vercel

1. **Fork this repository** to your GitHub account

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
   - Vercel will auto-detect Next.js settings

3. **Set Environment Variables:**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add the following variables:
     - \`NEXUS_RPC_URL\`: \`https://testnet3.rpc.nexus.xyz\`
     - \`NEXT_PUBLIC_NEXUS_ZKVM_URL\`: \`https://zkvm.testnet.nexus.xyz\`

4. **Deploy Smart Contracts:**
   \`\`\`bash
   # Install Hardhat
   npm install -g hardhat
   
   # Deploy contracts
   npx hardhat run scripts/deploy-registry.js --network nexus-testnet
   \`\`\`

5. **Update Contract Addresses:**
   - Copy the deployed contract address
   - Update \`frontend/.env.local\` with the contract address
   - Redeploy on Vercel

## 🎯 Features

- ✅ **One-Click Deploy**: Deploy to Vercel in minutes
- ✅ **Browser Verification**: All verification happens client-side
- ✅ **Minimal Blockchain**: Only essential hashes stored on-chain
- ✅ **Community Driven**: GitHub-based submission and voting
- ✅ **Static Generation**: Fast loading gallery pages
- ✅ **Mobile Responsive**: Works on all devices

## 🔧 Customization

- Update \`frontend/src/app/page.tsx\` for your branding
- Modify \`frontend/tailwind.config.js\` for custom styling
- Add your own categories in the submission form
- Customize the smart contract for your needs

## 📚 Documentation

- [Nexus zkVM Docs](https://docs.nexus.xyz/zkvm)
- [C2PA Specification](https://c2pa.org/specifications/)
- [Vercel Deployment Guide](https://vercel.com/docs)
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Update .env with your private key"
echo "2. Deploy smart contracts: npx hardhat run scripts/deploy-registry.js --network nexus-testnet"
echo "3. Update frontend/.env.local with contract addresses"
echo "4. Deploy to Vercel: vercel --prod"
echo ""
echo "📚 See DEPLOY.md for detailed instructions"
echo ""
echo "🎯 Your verifiable image provenance system is ready!"
