// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Bank
 * @dev Smart Contract untuk sistem perbankan dengan fitur:
 * - Transfer antar rekening dalam bank yang sama
 * - Transfer antar bank
 * - Pembelian produk (token listrik, dll)
 */
contract Bank is Ownable, ReentrancyGuard {
    // Struktur data rekening
    struct Account {
        address accountAddress;
        string accountNumber;
        string accountName;
        uint256 balance;
        bool exists;
        uint256 createdAt;
    }

    // Struktur data produk
    struct Product {
        uint256 productId;
        string productName;
        uint256 price;
        bool isActive;
        string description;
    }

    // Mapping untuk menyimpan rekening berdasarkan nomor rekening
    mapping(string => Account) public accounts;
    
    // Mapping untuk menyimpan rekening berdasarkan address
    mapping(address => string) public addressToAccountNumber;
    
    // Mapping untuk menyimpan produk
    mapping(uint256 => Product) public products;
    
    // Array untuk menyimpan semua nomor rekening
    string[] public accountNumbers;
    
    // Array untuk menyimpan semua produk
    uint256[] public productIds;
    
    // Informasi bank
    string public bankName;
    string public bankCode;
    
    // Event untuk logging transaksi
    event AccountCreated(
        string indexed accountNumber,
        address indexed accountAddress,
        string accountName,
        uint256 timestamp
    );
    
    event TransferInternal(
        string indexed fromAccount,
        string indexed toAccount,
        uint256 amount,
        string description,
        uint256 timestamp
    );
    
    event TransferExternal(
        string indexed fromAccount,
        string indexed toBankCode,
        string indexed toAccount,
        uint256 amount,
        string description,
        uint256 timestamp
    );
    
    event ProductPurchased(
        string indexed accountNumber,
        uint256 indexed productId,
        uint256 amount,
        string productName,
        uint256 timestamp
    );
    
    event Deposit(
        string indexed accountNumber,
        uint256 amount,
        uint256 timestamp
    );
    
    event Withdrawal(
        string indexed accountNumber,
        uint256 amount,
        uint256 timestamp
    );

    // Constructor
    constructor(string memory _bankName, string memory _bankCode) Ownable(msg.sender) {
        bankName = _bankName;
        bankCode = _bankCode;
    }

    /**
     * @dev Membuat rekening baru
     * @param _accountNumber Nomor rekening
     * @param _accountName Nama pemilik rekening
     */
    function createAccount(
        string memory _accountNumber,
        string memory _accountName
    ) external {
        require(bytes(_accountNumber).length > 0, "Nomor rekening tidak boleh kosong");
        require(bytes(_accountName).length > 0, "Nama rekening tidak boleh kosong");
        require(!accounts[_accountNumber].exists, "Rekening sudah ada");
        require(addressToAccountNumber[msg.sender] == "", "Address sudah terdaftar");

        accounts[_accountNumber] = Account({
            accountAddress: msg.sender,
            accountNumber: _accountNumber,
            accountName: _accountName,
            balance: 0,
            exists: true,
            createdAt: block.timestamp
        });

        addressToAccountNumber[msg.sender] = _accountNumber;
        accountNumbers.push(_accountNumber);

        emit AccountCreated(_accountNumber, msg.sender, _accountName, block.timestamp);
    }

    /**
     * @dev Deposit uang ke rekening
     * @param _accountNumber Nomor rekening
     */
    function deposit(string memory _accountNumber) external payable {
        require(accounts[_accountNumber].exists, "Rekening tidak ditemukan");
        require(msg.value > 0, "Jumlah deposit harus lebih dari 0");

        accounts[_accountNumber].balance += msg.value;

        emit Deposit(_accountNumber, msg.value, block.timestamp);
    }

    /**
     * @dev Withdraw uang dari rekening
     * @param _accountNumber Nomor rekening
     * @param _amount Jumlah yang akan ditarik
     */
    function withdraw(string memory _accountNumber, uint256 _amount) external nonReentrant {
        require(accounts[_accountNumber].exists, "Rekening tidak ditemukan");
        require(
            accounts[_accountNumber].accountAddress == msg.sender,
            "Hanya pemilik rekening yang dapat menarik"
        );
        require(_amount > 0, "Jumlah penarikan harus lebih dari 0");
        require(
            accounts[_accountNumber].balance >= _amount,
            "Saldo tidak mencukupi"
        );

        accounts[_accountNumber].balance -= _amount;
        payable(msg.sender).transfer(_amount);

        emit Withdrawal(_accountNumber, _amount, block.timestamp);
    }

    /**
     * @dev Transfer antar rekening dalam bank yang sama
     * @param _fromAccount Nomor rekening pengirim
     * @param _toAccount Nomor rekening penerima
     * @param _amount Jumlah transfer
     * @param _description Deskripsi transfer
     */
    function transferInternal(
        string memory _fromAccount,
        string memory _toAccount,
        uint256 _amount,
        string memory _description
    ) external {
        require(accounts[_fromAccount].exists, "Rekening pengirim tidak ditemukan");
        require(accounts[_toAccount].exists, "Rekening penerima tidak ditemukan");
        require(
            accounts[_fromAccount].accountAddress == msg.sender,
            "Hanya pemilik rekening yang dapat transfer"
        );
        require(_amount > 0, "Jumlah transfer harus lebih dari 0");
        require(
            accounts[_fromAccount].balance >= _amount,
            "Saldo tidak mencukupi"
        );
        require(
            keccak256(bytes(_fromAccount)) != keccak256(bytes(_toAccount)),
            "Tidak dapat transfer ke rekening sendiri"
        );

        accounts[_fromAccount].balance -= _amount;
        accounts[_toAccount].balance += _amount;

        emit TransferInternal(
            _fromAccount,
            _toAccount,
            _amount,
            _description,
            block.timestamp
        );
    }

    /**
     * @dev Transfer antar bank (memerlukan integrasi dengan bank lain)
     * @param _fromAccount Nomor rekening pengirim
     * @param _toBankCode Kode bank tujuan
     * @param _toAccount Nomor rekening tujuan
     * @param _amount Jumlah transfer
     * @param _description Deskripsi transfer
     */
    function transferExternal(
        string memory _fromAccount,
        string memory _toBankCode,
        string memory _toAccount,
        uint256 _amount,
        string memory _description
    ) external {
        require(accounts[_fromAccount].exists, "Rekening pengirim tidak ditemukan");
        require(
            accounts[_fromAccount].accountAddress == msg.sender,
            "Hanya pemilik rekening yang dapat transfer"
        );
        require(_amount > 0, "Jumlah transfer harus lebih dari 0");
        require(
            accounts[_fromAccount].balance >= _amount,
            "Saldo tidak mencukupi"
        );
        require(
            keccak256(bytes(bankCode)) != keccak256(bytes(_toBankCode)),
            "Gunakan transferInternal untuk transfer dalam bank yang sama"
        );

        // Kurangi saldo dari rekening pengirim
        accounts[_fromAccount].balance -= _amount;

        // Catat event transfer eksternal
        // Dalam implementasi nyata, ini akan memanggil smart contract bank tujuan
        emit TransferExternal(
            _fromAccount,
            _toBankCode,
            _toAccount,
            _amount,
            _description,
            block.timestamp
        );
    }

    /**
     * @dev Menambahkan produk baru (hanya owner)
     * @param _productId ID produk
     * @param _productName Nama produk
     * @param _price Harga produk
     * @param _description Deskripsi produk
     */
    function addProduct(
        uint256 _productId,
        string memory _productName,
        uint256 _price,
        string memory _description
    ) external onlyOwner {
        require(_price > 0, "Harga harus lebih dari 0");
        require(!products[_productId].isActive, "Produk sudah ada");

        products[_productId] = Product({
            productId: _productId,
            productName: _productName,
            price: _price,
            isActive: true,
            description: _description
        });

        productIds.push(_productId);
    }

    /**
     * @dev Membeli produk (misalnya token listrik)
     * @param _accountNumber Nomor rekening pembeli
     * @param _productId ID produk yang dibeli
     */
    function purchaseProduct(
        string memory _accountNumber,
        uint256 _productId
    ) external {
        require(accounts[_accountNumber].exists, "Rekening tidak ditemukan");
        require(
            accounts[_accountNumber].accountAddress == msg.sender,
            "Hanya pemilik rekening yang dapat membeli"
        );
        require(products[_productId].isActive, "Produk tidak tersedia");
        require(
            accounts[_accountNumber].balance >= products[_productId].price,
            "Saldo tidak mencukupi"
        );

        uint256 price = products[_productId].price;
        accounts[_accountNumber].balance -= price;

        emit ProductPurchased(
            _accountNumber,
            _productId,
            price,
            products[_productId].productName,
            block.timestamp
        );
    }

    /**
     * @dev Mendapatkan informasi rekening
     * @param _accountNumber Nomor rekening
     */
    function getAccount(string memory _accountNumber)
        external
        view
        returns (Account memory)
    {
        require(accounts[_accountNumber].exists, "Rekening tidak ditemukan");
        return accounts[_accountNumber];
    }

    /**
     * @dev Mendapatkan informasi produk
     * @param _productId ID produk
     */
    function getProduct(uint256 _productId)
        external
        view
        returns (Product memory)
    {
        require(products[_productId].isActive, "Produk tidak ditemukan");
        return products[_productId];
    }

    /**
     * @dev Mendapatkan semua nomor rekening
     */
    function getAllAccountNumbers() external view returns (string[] memory) {
        return accountNumbers;
    }

    /**
     * @dev Mendapatkan semua produk
     */
    function getAllProductIds() external view returns (uint256[] memory) {
        return productIds;
    }

    /**
     * @dev Mendapatkan saldo rekening
     * @param _accountNumber Nomor rekening
     */
    function getBalance(string memory _accountNumber)
        external
        view
        returns (uint256)
    {
        require(accounts[_accountNumber].exists, "Rekening tidak ditemukan");
        return accounts[_accountNumber].balance;
    }
}

