"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Add this type declaration at the top for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface VerificationResult {
  isValid: boolean;
  proofHash: string;
  imageHash: string;
  manifestHash: string;
  verifiedAt: string;
}

interface ProvenanceData {
  imageUrl: string;
  imageHash: string;
  manifestHash: string;
  proofHash: string;
  category: string;
}

interface BrowserVerifierProps {
  provenanceData: ProvenanceData;
  onVerificationComplete: (result: VerificationResult) => void;
}

export default function BrowserVerifier({ provenanceData, onVerificationComplete }: BrowserVerifierProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock Nexus zkVM verification function
  const verifyZKProof = async (
    proofHash: string,
    manifestHash: string,
    imageHash: string
  ): Promise<boolean> => {
    // In a real implementation, this would:
    // 1. Load Nexus zkVM SDK
    // 2. Verify the zero-knowledge proof
    // 3. Check that the proof corresponds to the manifest and image hashes
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock validation logic
    return proofHash.length === 64 && 
           manifestHash.length === 64 && 
           imageHash.length === 64;
  };

  // Mock C2PA manifest verification
  const verifyC2PAManifest = async (manifestHash: string): Promise<boolean> => {
    // In a real implementation, this would:
    // 1. Parse the C2PA manifest
    // 2. Validate the manifest structure
    // 3. Verify cryptographic signatures
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return manifestHash.length === 64;
  };

  // Mock image hash verification
  const verifyImageHash = async (imageUrl: string, expectedHash: string): Promise<boolean> => {
    // In a real implementation, this would:
    // 1. Fetch the image
    // 2. Calculate its hash
    // 3. Compare with expected hash
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    return expectedHash.length === 64;
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      console.log("🔍 Starting verification process...");
      
      // Step 1: Verify image hash
      console.log("🖼️ Verifying image hash...");
      const imageHashValid = await verifyImageHash(provenanceData.imageUrl, provenanceData.imageHash);
      if (!imageHashValid) {
        throw new Error("Image hash verification failed");
      }
      
      // Step 2: Verify C2PA manifest
      console.log("📄 Verifying C2PA manifest...");
      const manifestValid = await verifyC2PAManifest(provenanceData.manifestHash);
      if (!manifestValid) {
        throw new Error("C2PA manifest verification failed");
      }
      
      // Step 3: Verify zero-knowledge proof
      console.log("🔐 Verifying zero-knowledge proof...");
      const proofValid = await verifyZKProof(
        provenanceData.proofHash,
        provenanceData.manifestHash,
        provenanceData.imageHash
      );
      if (!proofValid) {
        throw new Error("Zero-knowledge proof verification failed");
      }

      const result: VerificationResult = {
        isValid: true,
        proofHash: provenanceData.proofHash,
        imageHash: provenanceData.imageHash,
        manifestHash: provenanceData.manifestHash,
        verifiedAt: new Date().toISOString()
      };

      setVerificationResult(result);
      onVerificationComplete(result);
      
      console.log("✅ Verification completed successfully!");

    } catch (err: any) {
      console.error("❌ Verification failed:", err);
      setError(err.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const registerOnBlockchain = async () => {
    if (!verificationResult) return;

    try {
      console.log("🔗 Registering on blockchain...");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // In a real implementation, this would call the SimpleProvenanceRegistry contract
      // For now, we'll simulate the transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("✅ Successfully registered on blockchain!");
      
    } catch (err: any) {
      console.error("❌ Blockchain registration failed:", err);
      setError(err.message || "Blockchain registration failed");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">🔍 Browser Verification</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Hash
          </label>
          <p className="text-sm text-gray-600 font-mono break-all">
            {provenanceData.imageHash}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            C2PA Manifest Hash
          </label>
          <p className="text-sm text-gray-600 font-mono break-all">
            {provenanceData.manifestHash}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zero-Knowledge Proof Hash
          </label>
          <p className="text-sm text-gray-600 font-mono break-all">
            {provenanceData.proofHash}
          </p>
        </div>

        {!verificationResult && (
          <button
            onClick={handleVerification}
            disabled={isVerifying}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isVerifying ? "Verifying..." : "Verify Proof"}
          </button>
        )}

        {verificationResult && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-800 font-medium">Verification Successful!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Verified at: {new Date(verificationResult.verifiedAt).toLocaleString()}
              </p>
            </div>

            <button
              onClick={registerOnBlockchain}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700"
            >
              Register on Blockchain
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">Verification Failed</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>🔒 <strong>Privacy-Preserving:</strong> Verification happens entirely in your browser</p>
        <p>⚡ <strong>Fast:</strong> No server round-trips required</p>
        <p>🔍 <strong>Transparent:</strong> All verification steps are visible</p>
      </div>
    </div>
  );
}
