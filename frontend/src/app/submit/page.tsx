"use client";
import { useState, useRef } from "react";
import { ethers } from "ethers";
import Link from "next/link";

// Add this type declaration at the top for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface SubmissionData {
  imageUrl: string;
  c2paManifestHash: string;
  zkProofHash: string;
  category: string;
}

export default function SubmitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "live-camera",
    "ai-generated",
    "digital-art",
    "photography",
    "screenshot",
    "other"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus("");
    }
  };

  const generateC2PAManifest = async (file: File): Promise<string> => {
    // In a real implementation, this would generate a C2PA manifest
    // For now, we'll create a mock hash based on file properties
    const fileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      timestamp: Date.now()
    };
    
    const manifestString = JSON.stringify(fileData);
    const encoder = new TextEncoder();
    const data = encoder.encode(manifestString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  };

  const generateZKProof = async (manifestHash: string, imageHash: string): Promise<string> => {
    // In a real implementation, this would use Nexus zkVM to generate a zero-knowledge proof
    // For now, we'll create a mock proof hash
    const proofData = {
      manifestHash,
      imageHash,
      timestamp: Date.now(),
      // This would be replaced with actual zkVM proof generation
      zkvmProof: "mock-proof-" + Math.random().toString(36).substr(2, 9)
    };
    
    const proofString = JSON.stringify(proofData);
    const encoder = new TextEncoder();
    const data = encoder.encode(proofString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  };

  const uploadImage = async (file: File): Promise<string> => {
    // In a real implementation, this would upload to IPFS or another decentralized storage
    // For now, we'll create a mock URL
    return `https://mock-storage.com/images/${file.name}-${Date.now()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !category) {
      setStatus("Please select a file and category");
      return;
    }

    setIsProcessing(true);
    setStatus("Processing image...");

    try {
      // Step 1: Upload image (mock implementation)
      setStatus("Uploading image...");
      const imageUrl = await uploadImage(file);
      
      // Step 2: Generate C2PA manifest
      setStatus("Generating C2PA manifest...");
      const c2paManifestHash = await generateC2PAManifest(file);
      
      // Step 3: Generate image hash
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const imageHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Step 4: Generate zero-knowledge proof
      setStatus("Generating zero-knowledge proof...");
      const zkProofHash = await generateZKProof(c2paManifestHash, imageHash);
      
      // Store submission data
      const data: SubmissionData = {
        imageUrl,
        c2paManifestHash,
        zkProofHash,
        category
      };
      
      setSubmissionData(data);
      setStatus("Proof generated successfully! Ready to mint NFT.");
      
    } catch (error: any) {
      setStatus("Error: " + (error.message || error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMintNFT = async () => {
    if (!submissionData) return;
    
    setStatus("Connecting to wallet...");
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // In a real implementation, this would deploy a new ProvenanceNFT contract
      // or use a factory contract to mint
      setStatus("Minting NFT...");
      
      // Mock NFT minting - in reality this would call the smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus("NFT minted successfully! You can now register it in the provenance registry.");
      
    } catch (error: any) {
      setStatus("Error minting NFT: " + (error.message || error));
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Submit Image for Provenance</h1>
          <p className="text-gray-600 mt-2">
            Upload an image and generate cryptographic proofs of its authenticity using Nexus zkVM.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Image File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {file && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={!file || !category || isProcessing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Generate Proof"}
              </button>
            </form>

            {status && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">{status}</p>
              </div>
            )}
          </div>

          {/* Submission Data */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Submission Data</h2>
            
            {submissionData ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <p className="text-sm text-gray-600 break-all">{submissionData.imageUrl}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">C2PA Manifest Hash</label>
                  <p className="text-sm text-gray-600 font-mono break-all">{submissionData.c2paManifestHash}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zero-Knowledge Proof Hash</label>
                  <p className="text-sm text-gray-600 font-mono break-all">{submissionData.zkProofHash}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-600">{submissionData.category}</p>
                </div>

                <button
                  onClick={handleMintNFT}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700"
                >
                  Mint NFT with Proof
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2">Submit an image to see the generated proof data</p>
              </div>
            )}
          </div>
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How It Works</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>1. <strong>Upload:</strong> Select an image file from your device</p>
            <p>2. <strong>C2PA Manifest:</strong> Generate a cryptographic manifest proving the image's provenance</p>
            <p>3. <strong>Zero-Knowledge Proof:</strong> Use Nexus zkVM to create a proof without revealing the original image</p>
            <p>4. <strong>Mint NFT:</strong> Create your own NFT with the proof embedded in metadata</p>
            <p>5. <strong>Register:</strong> Submit your NFT to the community registry for verification and rewards</p>
          </div>
        </div>
      </div>
    </main>
  );
}
