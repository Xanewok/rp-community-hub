// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IConfetti {
    function approve(address spender, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function burnFrom(address account, uint256 amount) external;

    function mint(address recipient, uint256 amount) external;
}
