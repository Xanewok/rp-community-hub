// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "./IParty.sol";

contract TestParty is Context, Ownable, IParty {
    mapping(address => uint256) _heroIds;
    mapping(address => uint32) _damages;

    function getDamage(address user) external view returns (uint32) {
        return _damages[user];
    }

    function setDamage(uint32 amount) external {
        _damages[_msgSender()] = amount;
    }

    function setDamageByOwner(address user, uint32 amount) external onlyOwner {
        _damages[user] = amount;
    }

    function getUserHero(address user) external view returns (uint256) {
        return _heroIds[user];
    }

    function setUserHero(uint256 heroId) external {
        _heroIds[_msgSender()] = heroId;
    }

    function setUserHeroByOwner(address user, uint256 heroId)
        external
        onlyOwner
    {
        _heroIds[user] = heroId;
    }
}
