// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract IDRToken is ERC20, AccessControl {
    bytes32 public constant ROLE_BANK = keccak256("ROLE_BANK");
    bytes32 public constant ROLE_OPERATOR = keccak256("ROLE_OPERATOR");

    constructor(address admin) ERC20("Demo IDR", "IDR") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function mint(address to, uint256 amount) external onlyRole(ROLE_BANK) {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyRole(ROLE_BANK) {
        _burn(from, amount);
    }

    function operatorTransfer(address from, address to, uint256 amount) external onlyRole(ROLE_OPERATOR) {
        _transfer(from, to, amount);
    }
}
