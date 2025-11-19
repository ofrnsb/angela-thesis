const hre = require("hardhat");

async function main() {
  console.log("Getting deployed contract addresses...\n");

  // Baca dari file deployment jika ada, atau gunakan default Hardhat addresses
  const defaultAddresses = {
    bankMandiri: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    bankBCA: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    interBankNetwork: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  };

  console.log("=== Deployed Contract Addresses ===");
  console.log("Bank Mandiri:", defaultAddresses.bankMandiri);
  console.log("Bank BCA:", defaultAddresses.bankBCA);
  console.log("InterBankNetwork:", defaultAddresses.interBankNetwork);
  console.log("\n=== Update these in frontend/src/App.jsx ===");
  console.log("BANK_MANDIRI_ADDRESS = '" + defaultAddresses.bankMandiri + "'");
  console.log("BANK_BCA_ADDRESS = '" + defaultAddresses.bankBCA + "'");
  console.log("INTER_BANK_NETWORK_ADDRESS = '" + defaultAddresses.interBankNetwork + "'");
  console.log("\nNote: These are default Hardhat addresses.");
  console.log("If you deployed in a different order, check the deployment output.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

