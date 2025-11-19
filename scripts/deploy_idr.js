const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [bankA, bankB, regulator, validator1, validator2, provider, user1, user2] = await ethers.getSigners();
  const code = (s) => ethers.encodeBytes32String(s);
  const u = (n) => ethers.parseUnits(n, 18);

  // Deploy contracts
  const IDR = await ethers.getContractFactory("IDRToken");
  const idr = await IDR.deploy(bankA.address); // admin = bankA for demo
  await idr.waitForDeployment();

  const Registry = await ethers.getContractFactory("AccountRegistry");
  const registry = await Registry.deploy(bankA.address);
  await registry.waitForDeployment();

  const Catalog = await ethers.getContractFactory("ProductCatalog");
  const catalog = await Catalog.deploy(bankA.address);
  await catalog.waitForDeployment();

  const Interbank = await ethers.getContractFactory("InterbankSettlement");
  const interbank = await Interbank.deploy(bankA.address, await idr.getAddress(), await registry.getAddress(), 2);
  await interbank.waitForDeployment();

  const Purchase = await ethers.getContractFactory("PurchaseProcessor");
  const purchase = await Purchase.deploy(bankA.address, await idr.getAddress(), await catalog.getAddress(), await registry.getAddress());
  await purchase.waitForDeployment();

  console.log("IDRToken:", await idr.getAddress());
  console.log("AccountRegistry:", await registry.getAddress());
  console.log("ProductCatalog:", await catalog.getAddress());
  console.log("InterbankSettlement:", await interbank.getAddress());
  console.log("PurchaseProcessor:", await purchase.getAddress());

  // Grant roles
  const ROLE_BANK = ethers.keccak256(ethers.toUtf8Bytes("ROLE_BANK"));
  const ROLE_OPERATOR = ethers.keccak256(ethers.toUtf8Bytes("ROLE_OPERATOR"));
  const ROLE_VALIDATOR = ethers.keccak256(ethers.toUtf8Bytes("ROLE_VALIDATOR"));
  const ROLE_GOVERNANCE = ethers.keccak256(ethers.toUtf8Bytes("ROLE_GOVERNANCE"));
  const ROLE_PROVIDER = ethers.keccak256(ethers.toUtf8Bytes("ROLE_PROVIDER"));

  await (await idr.connect(bankA).grantRole(ROLE_BANK, bankA.address)).wait();
  await (await idr.connect(bankA).grantRole(ROLE_BANK, bankB.address)).wait();
  await (await idr.connect(bankA).grantRole(ROLE_OPERATOR, await interbank.getAddress())).wait();
  await (await idr.connect(bankA).grantRole(ROLE_OPERATOR, await purchase.getAddress())).wait();

  await (await registry.connect(bankA).grantRole(ROLE_BANK, bankA.address)).wait();
  await (await registry.connect(bankA).grantRole(ROLE_BANK, bankB.address)).wait();

  await (await catalog.connect(bankA).grantRole(ROLE_PROVIDER, provider.address)).wait();

  await (await interbank.connect(bankA).grantRole(ROLE_BANK, bankA.address)).wait();
  await (await interbank.connect(bankA).grantRole(ROLE_BANK, bankB.address)).wait();
  await (await interbank.connect(bankA).grantRole(ROLE_VALIDATOR, validator1.address)).wait();
  await (await interbank.connect(bankA).grantRole(ROLE_VALIDATOR, validator2.address)).wait();
  await (await interbank.connect(bankA).grantRole(ROLE_GOVERNANCE, regulator.address)).wait();

  await (await purchase.connect(bankA).grantRole(ROLE_PROVIDER, provider.address)).wait();

  // Register demo accounts
  await (await registry.connect(bankA).registerAccount(code("BANKA"), "A-1001", user1.address)).wait();
  await (await registry.connect(bankA).registerAccount(code("BANKA"), "A-1002", user2.address)).wait();
  await (await registry.connect(bankB).registerAccount(code("BANKB"), "B-2001", provider.address)).wait();

  // Mint demo balances
  await (await idr.connect(bankA).mint(user1.address, u("1000000"))).wait(); // 1,000,000 IDR
  await (await idr.connect(bankA).mint(user2.address, u("500000"))).wait();  // 500,000 IDR
  await (await idr.connect(bankB).mint(provider.address, u("0"))).wait();    // provider starts at 0

  // Add product
  await (await catalog.connect(provider).addProduct("PLN-50K", u("50000"))).wait();

  const out = {
    IDRToken: await idr.getAddress(),
    AccountRegistry: await registry.getAddress(),
    ProductCatalog: await catalog.getAddress(),
    InterbankSettlement: await interbank.getAddress(),
    PurchaseProcessor: await purchase.getAddress(),
    accounts: {
      bankA: bankA.address,
      bankB: bankB.address,
      regulator: regulator.address,
      validator1: validator1.address,
      validator2: validator2.address,
      provider: provider.address,
      user1: user1.address,
      user2: user2.address,
    }
  };
  fs.writeFileSync("addresses.idr.local.json", JSON.stringify(out, null, 2));
  console.log("Seed complete. Addresses written to addresses.idr.local.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
