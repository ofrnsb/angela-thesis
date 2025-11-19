const hre = require("hardhat");

// Alamat kontrak setelah deployment
const BANK_MANDIRI_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const BANK_BCA_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

async function main() {
  const [owner] = await hre.ethers.getSigners();
  console.log("Adding products with account:", owner.address);

  const Bank = await hre.ethers.getContractFactory("Bank");
  
  // Bank Mandiri
  const bankMandiri = Bank.attach(BANK_MANDIRI_ADDRESS);
  
  console.log("\n=== Adding products to Bank Mandiri ===");
  
  // Token Listrik
  await bankMandiri.addProduct(
    1,
    "Token Listrik 20kWh",
    hre.ethers.parseEther("0.1"),
    "Token listrik untuk 20kWh - PLN"
  );
  console.log("✓ Product 1 added: Token Listrik 20kWh");

  // Token Listrik 50kWh
  await bankMandiri.addProduct(
    2,
    "Token Listrik 50kWh",
    hre.ethers.parseEther("0.25"),
    "Token listrik untuk 50kWh - PLN"
  );
  console.log("✓ Product 2 added: Token Listrik 50kWh");

  // Pulsa
  await bankMandiri.addProduct(
    3,
    "Pulsa 50.000",
    hre.ethers.parseEther("0.05"),
    "Pulsa seluler 50.000 untuk semua operator"
  );
  console.log("✓ Product 3 added: Pulsa 50.000");

  // Paket Data
  await bankMandiri.addProduct(
    4,
    "Paket Data 10GB",
    hre.ethers.parseEther("0.15"),
    "Paket data internet 10GB - 30 hari"
  );
  console.log("✓ Product 4 added: Paket Data 10GB");

  // Bank BCA
  const bankBCA = Bank.attach(BANK_BCA_ADDRESS);
  
  console.log("\n=== Adding products to Bank BCA ===");
  
  await bankBCA.addProduct(
    1,
    "Token Listrik 20kWh",
    hre.ethers.parseEther("0.1"),
    "Token listrik untuk 20kWh - PLN"
  );
  console.log("✓ Product 1 added: Token Listrik 20kWh");

  await bankBCA.addProduct(
    2,
    "Token Listrik 50kWh",
    hre.ethers.parseEther("0.25"),
    "Token listrik untuk 50kWh - PLN"
  );
  console.log("✓ Product 2 added: Token Listrik 50kWh");

  await bankBCA.addProduct(
    3,
    "Pulsa 50.000",
    hre.ethers.parseEther("0.05"),
    "Pulsa seluler 50.000 untuk semua operator"
  );
  console.log("✓ Product 3 added: Pulsa 50.000");

  await bankBCA.addProduct(
    4,
    "Paket Data 10GB",
    hre.ethers.parseEther("0.15"),
    "Paket data internet 10GB - 30 hari"
  );
  console.log("✓ Product 4 added: Paket Data 10GB");

  console.log("\n✅ All products added successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

