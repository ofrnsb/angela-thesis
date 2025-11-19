// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ProductCatalog is AccessControl {
    bytes32 public constant ROLE_PROVIDER = keccak256("ROLE_PROVIDER");

    struct Product {
        string id;
        address provider;
        uint256 price;
        bool active;
    }

    mapping(string => Product) private products;

    event ProductAdded(string id, address provider, uint256 price);
    event ProductStatusChanged(string id, bool active);
    event ProductPriceChanged(string id, uint256 price);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function addProduct(string calldata id, uint256 price) external onlyRole(ROLE_PROVIDER) {
        require(bytes(id).length > 0, "id");
        require(price > 0, "price");
        Product storage p = products[id];
        require(!p.active, "exists");
        p.id = id;
        p.provider = msg.sender;
        p.price = price;
        p.active = true;
        emit ProductAdded(id, msg.sender, price);
    }

    function setActive(string calldata id, bool active) external {
        Product storage p = products[id];
        require(p.active || active, "no prod");
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || hasRole(ROLE_PROVIDER, msg.sender), "role");
        require(p.provider == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "owner");
        p.active = active;
        emit ProductStatusChanged(id, active);
    }

    function setPrice(string calldata id, uint256 price) external onlyRole(ROLE_PROVIDER) {
        require(price > 0, "price");
        Product storage p = products[id];
        require(p.active, "no prod");
        require(p.provider == msg.sender, "owner");
        p.price = price;
        emit ProductPriceChanged(id, price);
    }

    function getProduct(string calldata id) external view returns (address provider, uint256 price, bool active) {
        Product storage p = products[id];
        return (p.provider, p.price, p.active);
    }
}
