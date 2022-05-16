// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRaid {
    function lastSnapshotTime() external returns (uint64);

    function commitSnapshot() external;

    function claimRewards(address user) external;

    function getPendingRewards(address user) external view returns (uint256);
}
