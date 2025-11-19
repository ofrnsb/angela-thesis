// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AccountRegistry is AccessControl {
    bytes32 public constant ROLE_BANK = keccak256("ROLE_BANK");

    struct Account {
        address owner;
        bytes32 bank;
        bool exists;
    }

    mapping(string => Account) private accounts;

    event AccountRegistered(string accountNumber, address owner, bytes32 bank);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function registerAccount(bytes32 bank, string calldata accountNumber, address owner) external onlyRole(ROLE_BANK) {
        require(owner != address(0), "owner");
        Account storage a = accounts[accountNumber];
        require(!a.exists, "exists");
        a.owner = owner;
        a.bank = bank;
        a.exists = true;
        emit AccountRegistered(accountNumber, owner, bank);
    }

    function resolveAccount(string calldata accountNumber) external view returns (address owner, bytes32 bank, bool exists) {
        Account storage a = accounts[accountNumber];
        return (a.owner, a.bank, a.exists);
    }
}
