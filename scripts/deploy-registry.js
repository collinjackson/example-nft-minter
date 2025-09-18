const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ProvenanceRegistry...");

  // Get the contract factory
  const ProvenanceRegistry = await ethers.getContractFactory("ProvenanceRegistry");
  
  // Deploy the contract
  const registry = await ProvenanceRegistry.deploy();
  await registry.waitForDeployment();

  const registryAddress = await registry.getAddress();
  console.log("ProvenanceRegistry deployed to:", registryAddress);

  // Set verification threshold (optional)
  const threshold = 5;
  await registry.setVerificationThreshold(threshold);
  console.log(`Verification threshold set to: ${threshold}`);

  console.log("\nDeployment completed!");
  console.log("Registry Address:", registryAddress);
  console.log("Verification Threshold:", threshold);
  
  // Save deployment info
  const deploymentInfo = {
    network: "nexus-testnet",
    registryAddress: registryAddress,
    verificationThreshold: threshold,
    deployedAt: new Date().toISOString()
  };

  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
