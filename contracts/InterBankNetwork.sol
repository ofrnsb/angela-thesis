// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Bank.sol";

/**
 * @title InterBankNetwork
 * @dev Smart Contract untuk mengelola jaringan antar bank
 * Memungkinkan transfer antar bank yang berbeda
 */
contract InterBankNetwork is Ownable {
    // Mapping untuk menyimpan alamat smart contract bank berdasarkan kode bank
    mapping(string => address) public banks;
    
    // Array untuk menyimpan semua kode bank yang terdaftar
    string[] public bankCodes;
    
    // Event untuk logging
    event BankRegistered(string indexed bankCode, address indexed bankAddress);
    event InterBankTransfer(
        string indexed fromBankCode,
        string indexed fromAccount,
        string indexed toBankCode,
        string indexed toAccount,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Mendaftarkan bank ke dalam jaringan
     * @param _bankCode Kode bank
     * @param _bankAddress Alamat smart contract bank
     */
    function registerBank(string memory _bankCode, address _bankAddress) external onlyOwner {
        require(bytes(_bankCode).length > 0, "Kode bank tidak boleh kosong");
        require(_bankAddress != address(0), "Alamat bank tidak valid");
        require(banks[_bankCode] == address(0), "Bank sudah terdaftar");

        banks[_bankCode] = _bankAddress;
        bankCodes.push(_bankCode);

        emit BankRegistered(_bankCode, _bankAddress);
    }

    /**
     * @dev Transfer antar bank
     * @param _fromBankCode Kode bank pengirim
     * @param _fromAccount Nomor rekening pengirim
     * @param _toBankCode Kode bank penerima
     * @param _toAccount Nomor rekening penerima
     * @param _amount Jumlah transfer
     */
    function transferInterBank(
        string memory _fromBankCode,
        string memory _fromAccount,
        string memory _toBankCode,
        string memory _toAccount,
        uint256 _amount
    ) external {
        require(banks[_fromBankCode] != address(0), "Bank pengirim tidak terdaftar");
        require(banks[_toBankCode] != address(0), "Bank penerima tidak terdaftar");
        require(
            keccak256(bytes(_fromBankCode)) != keccak256(bytes(_toBankCode)),
            "Gunakan transfer internal untuk transfer dalam bank yang sama"
        );

        // Panggil fungsi transferExternal di bank pengirim
        Bank fromBank = Bank(banks[_fromBankCode]);
        fromBank.transferExternal(
            _fromAccount,
            _toBankCode,
            _toAccount,
            _amount,
            "Transfer Antar Bank"
        );

        // Dalam implementasi nyata, bank penerima akan menerima notifikasi
        // dan menambahkan saldo ke rekening tujuan
        // Untuk demo, kita hanya emit event
        emit InterBankTransfer(
            _fromBankCode,
            _fromAccount,
            _toBankCode,
            _toAccount,
            _amount,
            block.timestamp
        );
    }

    /**
     * @dev Mendapatkan alamat bank berdasarkan kode bank
     * @param _bankCode Kode bank
     */
    function getBankAddress(string memory _bankCode) external view returns (address) {
        return banks[_bankCode];
    }

    /**
     * @dev Mendapatkan semua kode bank yang terdaftar
     */
    function getAllBankCodes() external view returns (string[] memory) {
        return bankCodes;
    }
}

