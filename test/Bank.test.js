const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank Contract", function () {
  let bank;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const Bank = await ethers.getContractFactory("Bank");
    bank = await Bank.deploy("Bank Mandiri", "BM");
    await bank.waitForDeployment();
  });

  describe("Account Creation", function () {
    it("Should create a new account", async function () {
      await bank.connect(addr1).createAccount("1234567890", "Budi Santoso");
      
      const account = await bank.getAccount("1234567890");
      expect(account.accountNumber).to.equal("1234567890");
      expect(account.accountName).to.equal("Budi Santoso");
      expect(account.accountAddress).to.equal(addr1.address);
      expect(account.balance).to.equal(0);
    });

    it("Should reject duplicate account number", async function () {
      await bank.connect(addr1).createAccount("1234567890", "Budi Santoso");
      
      await expect(
        bank.connect(addr2).createAccount("1234567890", "Siti Nurhaliza")
      ).to.be.revertedWith("Rekening sudah ada");
    });
  });

  describe("Deposit", function () {
    beforeEach(async function () {
      await bank.connect(addr1).createAccount("1234567890", "Budi Santoso");
    });

    it("Should deposit ETH to account", async function () {
      const depositAmount = ethers.parseEther("1.0");
      
      await bank.connect(addr1).deposit("1234567890", { value: depositAmount });
      
      const balance = await bank.getBalance("1234567890");
      expect(balance).to.equal(depositAmount);
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      await bank.connect(addr1).createAccount("1234567890", "Budi Santoso");
      await bank.connect(addr1).deposit("1234567890", { value: ethers.parseEther("2.0") });
    });

    it("Should withdraw ETH from account", async function () {
      const withdrawAmount = ethers.parseEther("0.5");
      const initialBalance = await ethers.provider.getBalance(addr1.address);
      
      const tx = await bank.connect(addr1).withdraw("1234567890", withdrawAmount);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      const finalBalance = await ethers.provider.getBalance(addr1.address);
      const accountBalance = await bank.getBalance("1234567890");
      
      expect(accountBalance).to.equal(ethers.parseEther("1.5"));
      expect(finalBalance).to.equal(initialBalance + withdrawAmount - gasUsed);
    });

    it("Should reject withdrawal with insufficient balance", async function () {
      await expect(
        bank.connect(addr1).withdraw("1234567890", ethers.parseEther("3.0"))
      ).to.be.revertedWith("Saldo tidak mencukupi");
    });
  });

  describe("Internal Transfer", function () {
    beforeEach(async function () {
      await bank.connect(addr1).createAccount("1234567890", "Budi Santoso");
      await bank.connect(addr2).createAccount("0987654321", "Siti Nurhaliza");
      await bank.connect(addr1).deposit("1234567890", { value: ethers.parseEther("1.0") });
    });

    it("Should transfer between accounts", async function () {
      const transferAmount = ethers.parseEther("0.5");
      
      await bank.connect(addr1).transferInternal(
        "1234567890",
        "0987654321",
        transferAmount,
        "Transfer test"
      );
      
      const balance1 = await bank.getBalance("1234567890");
      const balance2 = await bank.getBalance("0987654321");
      
      expect(balance1).to.equal(ethers.parseEther("0.5"));
      expect(balance2).to.equal(transferAmount);
    });

    it("Should reject transfer with insufficient balance", async function () {
      await expect(
        bank.connect(addr1).transferInternal(
          "1234567890",
          "0987654321",
          ethers.parseEther("2.0"),
          "Transfer test"
        )
      ).to.be.revertedWith("Saldo tidak mencukupi");
    });
  });

  describe("Product Management", function () {
    it("Should add product as owner", async function () {
      await bank.connect(owner).addProduct(
        1,
        "Token Listrik 20kWh",
        ethers.parseEther("0.1"),
        "Token listrik untuk 20kWh"
      );
      
      const product = await bank.getProduct(1);
      expect(product.productName).to.equal("Token Listrik 20kWh");
      expect(product.price).to.equal(ethers.parseEther("0.1"));
    });

    it("Should reject adding product as non-owner", async function () {
      await expect(
        bank.connect(addr1).addProduct(
          1,
          "Token Listrik",
          ethers.parseEther("0.1"),
          "Test"
        )
      ).to.be.reverted;
    });
  });

  describe("Product Purchase", function () {
    beforeEach(async function () {
      await bank.connect(owner).addProduct(
        1,
        "Token Listrik 20kWh",
        ethers.parseEther("0.1"),
        "Token listrik untuk 20kWh"
      );
      await bank.connect(addr1).createAccount("1234567890", "Budi Santoso");
      await bank.connect(addr1).deposit("1234567890", { value: ethers.parseEther("1.0") });
    });

    it("Should purchase product", async function () {
      await bank.connect(addr1).purchaseProduct("1234567890", 1);
      
      const balance = await bank.getBalance("1234567890");
      expect(balance).to.equal(ethers.parseEther("0.9"));
    });

    it("Should reject purchase with insufficient balance", async function () {
      await bank.connect(addr2).createAccount("1111111111", "Siti");
      await expect(
        bank.connect(addr2).purchaseProduct("1111111111", 1)
      ).to.be.revertedWith("Saldo tidak mencukupi");
    });
  });
});

