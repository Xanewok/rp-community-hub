// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract TestConfetti is ERC20PresetMinterPauser {
    constructor() ERC20PresetMinterPauser("TestConfetti", "TCFTI") {}

    /**
     * @dev Creates `amount` new tokens for `to`.
     *
     * Since this is a test contract, everyone can mint new tokens for ease
     * of development.
     */
    function mint(address to, uint256 amount) public override {
        _mint(to, amount);
    }
}
