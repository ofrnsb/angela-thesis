// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IDRToken.sol";
import "./AccountRegistry.sol";

contract InterbankSettlement is AccessControl {
    bytes32 public constant ROLE_BANK = keccak256("ROLE_BANK");
    bytes32 public constant ROLE_VALIDATOR = keccak256("ROLE_VALIDATOR");
    bytes32 public constant ROLE_GOVERNANCE = keccak256("ROLE_GOVERNANCE");

    struct TransferRequest {
        uint256 id;
        string fromAccount;
        string toAccount;
        uint256 amount;
        bytes32 proposerBank;
        uint256 approvals;
        bool executed;
        uint256 createdAt;
    }

    IDRToken public immutable token;
    AccountRegistry public immutable registry;

    uint256 public threshold;
    uint256 public nextId;

    mapping(uint256 => TransferRequest) public requests;
    mapping(uint256 => mapping(address => bool)) public approvedBy;

    event TransferProposed(uint256 id, string fromAccount, string toAccount, uint256 amount, bytes32 proposerBank);
    event TransferApproved(uint256 id, address validator, uint256 totalApprovals);
    event InterbankSettled(uint256 id, address from, address to, uint256 amount);
    event TransferCancelled(uint256 id);

    constructor(address admin, address _token, address _registry, uint256 _threshold) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        token = IDRToken(_token);
        registry = AccountRegistry(_registry);
        threshold = _threshold;
    }

    function setThreshold(uint256 _threshold) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_threshold > 0, "threshold");
        threshold = _threshold;
    }

    function proposeTransfer(bytes32 proposerBank, string calldata fromAccount, string calldata toAccount, uint256 amount)
        external
        onlyRole(ROLE_BANK)
        returns (uint256 id)
    {
        require(amount > 0, "amount");
        (address fromAddr, , bool fromExists) = registry.resolveAccount(fromAccount);
        (address toAddr, , bool toExists) = registry.resolveAccount(toAccount);
        require(fromExists && toExists, "acct");
        id = ++nextId;
        requests[id] = TransferRequest({
            id: id,
            fromAccount: fromAccount,
            toAccount: toAccount,
            amount: amount,
            proposerBank: proposerBank,
            approvals: 0,
            executed: false,
            createdAt: block.timestamp
        });
        emit TransferProposed(id, fromAccount, toAccount, amount, proposerBank);
        // optional: auto-approve by proposer if also a validator (not in minimal skeleton)
        (fromAddr, toAddr); // silence warnings for minimal skeleton
    }

    function approveTransfer(uint256 id) external onlyRole(ROLE_VALIDATOR) {
        TransferRequest storage r = requests[id];
        require(r.id != 0 && !r.executed, "bad");
        require(!approvedBy[id][msg.sender], "dup");
        approvedBy[id][msg.sender] = true;
        r.approvals += 1;
        emit TransferApproved(id, msg.sender, r.approvals);
        if (r.approvals >= threshold) {
            _execute(id);
        }
    }

    function cancelTransfer(uint256 id) external onlyRole(ROLE_GOVERNANCE) {
        TransferRequest storage r = requests[id];
        require(r.id != 0 && !r.executed, "bad");
        r.executed = true;
        emit TransferCancelled(id);
    }

    function _execute(uint256 id) internal {
        TransferRequest storage r = requests[id];
        require(!r.executed, "done");
        (address fromAddr, , ) = registry.resolveAccount(r.fromAccount);
        (address toAddr, , ) = registry.resolveAccount(r.toAccount);
        r.executed = true;
        token.operatorTransfer(fromAddr, toAddr, r.amount);
        emit InterbankSettled(id, fromAddr, toAddr, r.amount);
    }
}
