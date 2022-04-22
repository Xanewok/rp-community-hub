// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./IRaid.sol";
import "./IRPSeeder.sol";

interface IConfetti {
    function burnFrom(address account, uint256 amount) external;
}

interface IParty {
        function getUserHero(address user)
        external
        view
        override
        returns (uint256)
    {
}

/**
 * @title
 * @author xanewok.eth
 * @dev
 */
contract RaffleParty is Context, Ownable, Pausable, AccessControlEnumerable {
    IConfetti public immutable _confetti;
    IParty public immutable _party;
    IRpSeeder public immutable _rpSeeder;

    Raffle[] public _raffles;

    uint32 _raffleCount;

    bytes32 public constant RAFFLE_CREATOR = keccak256("RAFFLE_CREATOR");

    event RaffleCreated(uint256 indexed raffleId, address indexed creator);

    struct Raffle {
        uint256 cost;
        uint256 endingSeedRound;
        uint64 maxEntries;
        mapping(address => uint256) ticketsBought;
        address[] participants;
        uint256 totalTicketsBought;
    }

    constructor(
        address confetti,
        address party,
        address rpSeeder,
        address admin
    ) {
        _setupRole(RAFFLE_CREATOR, admin);

        _raffleCount = 0;
        _rpSeeder = IRpSeeder(rpSeeder);
        _confetti = IConfetti(confetti);
        _party = IRaid(raid);
    }

    function createRaffle(
        uint64 maxEntries,
        uint256 cost,
        uint256 endingSeedRound
    ) public onlyRole(RAFFLE_CREATOR) whenNotPaused {
        requireNotSeeded(endingSeedRound);

        Raffle storage newRaffle = _raffles[_raffleCount];

        newRaffle.maxEntries = maxEntries;
        newRaffle.cost = cost;
        newRaffle.endingSeedRound = endingSeedRound;

        emit RaffleCreated(_raffleCount, _msgSender());

        _raffleCount += 1;
    }

    function buyTickets(uint256 raffleId, uint256 count) public whenNotPaused {
        Raffle storage raffle = _raffles[raffleId];
        requireNotSeeded(raffle.endingSeedRound);
        require(raffle.totalTicketsBought < raffle.maxEntries, "Sold out");
        require(_party.getUserHero(_msgSender()) != 0, "No hero staked");

        uint256 ticketCount = Math.min(
            raffle.maxEntries - raffle.totalTicketsBought,
            count
        );

        // TODO: Figure out exact tokenomics
        uint256 cost = ticketCount * raffle.cost;
        _confetti.burnFrom(_msgSender(), cost);
        if (raffle.ticketsBought[_msgSender()] == 0) {
            raffle.participants.push(_msgSender());
        }
        raffle.ticketsBought[_msgSender()] += ticketCount;
    }

    /// @dev This is a naive, expensive version that should be only read off-chain.
    /// This simply creates a shuffled list of raffle ticket winners - the caller
    /// is responsible to handle players that have already won, verify their
    /// eligibility for the raffle and so on.
    function raffleWinners(uint256 raffleId)
        public
        view
        returns (address[] memory)
    {
        Raffle storage raffle = _raffles[raffleId];
        uint256 seed = getSeed(raffle.endingSeedRound);
        require(seed != 0, "Raffle not finished");

        // NOTE: This is *very* naive. Ideally, we could create a tree where we
        // can maintain a O(lg N) lookup on the ticket number (where nodes store
        // the total tickets in their subtrees) and apply a pseudorandom permutation
        // function.
        // This way, the storage cost would be 2*|participants| rather than
        // |totalTickets|
        address[] memory tickets = new address[](raffle.totalTicketsBought);
        for (uint256 i = 0; i < raffle.participants.length; i++) {
            address participant = raffle.participants[i];
            uint256 ticketsBought = raffle.ticketsBought[participant];
            for (uint256 j = 0; j < ticketsBought; j++) {
                tickets[i + j] = participant;
            }
        }

        return shuffledAddresses(tickets, seed);
    }

    // Utility functions

    function requireNotSeeded(uint256 roundNum) private view {
        // Mitigate possible front-running - close the sign-ups about a minute
        // before the seeder can request randomness. The RP seeder is pre-configured
        // to require 3 block confirmations, so 60 seconds makes sense (< 3 * avg block time of 14s)
        require(getSeed(roundNum) == 0, "Already seeded");
        require(
            _rpSeeder.getNextAvailableBatch() > (block.timestamp + 60),
            "Seed imminent; sign-up is closed"
        );
    }

    /// @notice Return generated random words for a given seed round
    function getSeed(uint256 roundNum) public view returns (uint256) {
        bytes32 reqId = _rpSeeder.getReqByBatch(roundNum);
        return _rpSeeder.getRandomness(reqId);
    }

    /// @return Randomly shuffled addresses from the given ones, using supplied seed
    /// @dev Knuth shuffle
    function shuffledAddresses(address[] memory addresses, uint256 seed)
        public
        pure
        returns (address[] memory)
    {
        address[] memory shuffled = addresses;

        uint256 pick;
        for (uint256 i = 0; i < addresses.length - 1; i++) {
            // Randomly pick a value from i (incl.) till the end of the array
            // To further increase randomness entropy, add the current player address
            pick =
                uint256(keccak256(abi.encodePacked(addresses[i], seed))) %
                (addresses.length - i);

            (shuffled[i], shuffled[i + pick]) = (
                // Save the randomly picked number as the i-th address in the sequence
                shuffled[i + pick],
                // Return the original value to the pool that we pick from
                shuffled[i]
            );
        }

        return shuffled;
    }
}
