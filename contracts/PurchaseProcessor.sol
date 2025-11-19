// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IDRToken.sol";
import "./ProductCatalog.sol";
import "./AccountRegistry.sol";

contract PurchaseProcessor is AccessControl {
    bytes32 public constant ROLE_PROVIDER = keccak256("ROLE_PROVIDER");

    struct Order {
        uint256 id;
        string buyerAccount;
        string productId;
        uint256 amount;
        address provider;
        address buyerAddress;
        bool finished;
        bool fulfilled;
        uint256 createdAt;
    }

    IDRToken public immutable token;
    ProductCatalog public immutable catalog;
    AccountRegistry public immutable registry;

    uint256 public nextId;
    mapping(uint256 => Order) public orders;

    event PurchaseCommitted(uint256 id, string buyerAccount, string productId, uint256 amount, address provider);
    event PurchaseFulfilled(uint256 id);
    event PurchaseFailed(uint256 id);

    constructor(address admin, address _token, address _catalog, address _registry) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        token = IDRToken(_token);
        catalog = ProductCatalog(_catalog);
        registry = AccountRegistry(_registry);
    }

    function createPurchase(string calldata buyerAccount, string calldata productId) external returns (uint256 id) {
        (address buyer, , bool exists) = registry.resolveAccount(buyerAccount);
        require(exists, "acct");
        (address provider, uint256 price, bool active) = catalog.getProduct(productId);
        require(active && provider != address(0) && price > 0, "prod");
        id = ++nextId;
        orders[id] = Order({
            id: id,
            buyerAccount: buyerAccount,
            productId: productId,
            amount: price,
            provider: provider,
            buyerAddress: buyer,
            finished: false,
            fulfilled: false,
            createdAt: block.timestamp
        });
        // Move funds into escrow (this contract). Requires ROLE_OPERATOR on token for this contract.
        token.operatorTransfer(buyer, address(this), price);
        emit PurchaseCommitted(id, buyerAccount, productId, price, provider);
    }

    function markFulfilled(uint256 id) external onlyRole(ROLE_PROVIDER) {
        Order storage o = orders[id];
        require(o.id != 0 && !o.finished, "bad");
        require(o.provider == msg.sender, "owner");
        o.finished = true;
        o.fulfilled = true;
        token.operatorTransfer(address(this), o.provider, o.amount);
        emit PurchaseFulfilled(id);
    }

    function markFailed(uint256 id) external onlyRole(ROLE_PROVIDER) {
        Order storage o = orders[id];
        require(o.id != 0 && !o.finished, "bad");
        require(o.provider == msg.sender, "owner");
        o.finished = true;
        token.operatorTransfer(address(this), o.buyerAddress, o.amount);
        emit PurchaseFailed(id);
    }
}
