// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IConfetti {
    function burnFrom(address account, uint256 amount) external;

    function mint(address recipient, uint256 amount) external;
}
