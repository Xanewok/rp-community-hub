// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IRaid {
    function claimRewards(address user) external;

    function getPendingRewards(address user) external view returns (uint256);
}

/// @title Convenience contract to collect pending Raid Party rewards from multiple wallets
/// @author xanewok.eth
contract RpYieldCollector is Ownable {
    IERC20 public immutable _confetti;
    IRaid public immutable _raid;
    uint256 public constant TAX_PRECISION = 1e4;

    constructor(address confetti, address raid) {
        _confetti = IERC20(confetti);
        _raid = IRaid(raid);
    }

    /// @notice Claims RP pending rewards for each wallet
    function claimMultipleRewards(address[] calldata wallets) public {
        for (uint256 i = 0; i < wallets.length; i++) {
            _raid.claimRewards(wallets[i]);
        }
    }

    /// @dev You should read `isApproved` first to make sure each wallet has ERC20 approval
    function claimMultipleRewardsTo(
        address[] calldata wallets,
        address recipient
    ) public returns (uint256) {
        uint256 totalClaimedRewards = 0;
        for (uint256 i = 0; i < wallets.length; i++) {
            uint256 pendingRewards = _raid.getPendingRewards(wallets[i]);
            totalClaimedRewards += pendingRewards;

            _raid.claimRewards(wallets[i]);

            if (wallets[i] != recipient) {
                _confetti.transferFrom(wallets[i], recipient, pendingRewards);
            }
        }

        return totalClaimedRewards;
    }

    /// @notice Claims rewards from the wallets to a single wallet, while also
    /// collecting a tax. Tax decimals is 4, meaning that to collect e.g. 3% you
    /// need to pass `300`, to collect 10% pass `1000` and so on.
    function taxedClaimMultipleRewardsTo(
        address[] calldata wallets,
        address recipient,
        uint256 tax,
        address taxRecipient
    ) public {
        require(tax <= TAX_PRECISION, "Can't collect over 100%");
        // We temporarily move the rewards to this address to collect a tax and
        // then send the remainder to the designated recipient
        uint256 claimedRewards = claimMultipleRewardsTo(wallets, address(this));

        uint256 collectedTax = (claimedRewards * tax) / TAX_PRECISION;
        _confetti.transfer(taxRecipient, collectedTax);
        _confetti.transfer(recipient, claimedRewards - collectedTax);
    }

    /// @notice Moves all of the pending rewards to a single of those wallets
    function claimMultipleRewardsToSafe(
        address[] calldata wallets,
        uint256 recipientIndex
    ) external {
        require(
            recipientIndex < wallets.length,
            "Recipient outside of the wallets"
        );
        address recipient = wallets[recipientIndex];

        claimMultipleRewardsTo(wallets, recipient);
    }

    /// @notice Whether the wallets are approved to move the pending rewards
    function isApproved(address[] calldata wallets)
        external
        view
        returns (bool)
    {
        for (uint256 i = 0; i < wallets.length; i++) {
            uint256 pendingRewards = _raid.getPendingRewards(wallets[i]);
            if (
                _confetti.allowance(wallets[i], address(this)) + 1e18 <
                pendingRewards
            ) {
                return false;
            }
        }
        return true;
    }

    /// @notice Convenient function that returns total pending rewards for given wallets
    function getPendingRewards(address[] calldata wallets)
        public
        view
        returns (uint256)
    {
        uint256 sum = 0;
        for (uint256 i = 0; i < wallets.length; i++) {
            sum += _raid.getPendingRewards(wallets[i]);
        }
        return sum;
    }
}
