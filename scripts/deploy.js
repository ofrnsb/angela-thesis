const hre = require("hardhat");

async function main() {
  console.log("Deploying smart contracts...");

  // Deploy Bank contracts
  const Bank = await hre.ethers.getContractFactory("Bank");
  
  const bank1 = await Bank.deploy("Bank Mandiri", "BM");
  await bank1.waitForDeployment();
  console.log("Bank Mandiri deployed to:", await bank1.getAddress());

  const bank2 = await Bank.deploy("Bank BCA", "BCA");
  await bank2.waitForDeployment();
  console.log("Bank BCA deployed to:", await bank2.getAddress());

  // Deploy InterBankNetwork
  const InterBankNetwork = await hre.ethers.getContractFactory("InterBankNetwork");
  const interBankNetwork = await InterBankNetwork.deploy();
  await interBankNetwork.waitForDeployment();
  console.log("InterBankNetwork deployed to:", await interBankNetwork.getAddress());

  // Register banks to network
  const [owner] = await hre.ethers.getSigners();
  await interBankNetwork.registerBank("BM", await bank1.getAddress());
  await interBankNetwork.registerBank("BCA", await bank2.getAddress());
  console.log("Banks registered to network");

  // Save deployment addresses
  const deploymentInfo = {
    bankMandiri: await bank1.getAddress(),
    bankBCA: await bank2.getAddress(),
    interBankNetwork: await interBankNetwork.getAddress(),
    network: "localhost"
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

