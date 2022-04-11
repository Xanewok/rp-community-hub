// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Mintable {
    function mint(address recipient, uint256 amount) external;
}

contract TestRaid {
    Mintable immutable _confetti;
    mapping(address => uint256) _pendingRewards;

    constructor(address confetti) {
        _confetti = Mintable(confetti);
    }

    function setPendingRewards(address wallet, uint256 amount) public {
        _pendingRewards[wallet] = amount;
    }

    function claimRewards(address user) external {
        uint256 pendingRewards = getPendingRewards(user);
        setPendingRewards(user, 0);
        _confetti.mint(user, pendingRewards);
    }

    function getPendingRewards(address user) public view returns (uint256) {
        return _pendingRewards[user];
    }
}
