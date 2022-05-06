const assert = require("assert");
const { BigNumber } = require("bignumber.js");

const TestConfetti = artifacts.require("TestConfetti");
const TestSeederV2 = artifacts.require("TestSeederV2");
const TestSeedStorage = artifacts.require("TestSeedStorage");
const TestParty = artifacts.require("TestParty");

const RaffleParty = artifacts.require("RaffleParty");
const RpSeeder = artifacts.require("RpSeeder")

// Returns a current timestamp in *seconds* - similar to `block.timestamp`.
const timestamp = () => Math.trunc(new Date().getTime() / 1000);

const CFTI = (num) => `${BigNumber(num).times(BigNumber(10).pow(18))}`;

async function setSeedForRound(roundNum, seed) {
  const seederV2 = await TestSeederV2.deployed();
  const seedStorage = await TestSeedStorage.deployed();
  const raffleParty = await RaffleParty.deployed();

  const reqId = await web3.utils.keccak256(`My test prefix ${roundNum}`);
  await seederV2.setBatchToReqId(roundNum, reqId);
  await seedStorage.setRandomness(reqId, seed);

  assert.equal(seed, await raffleParty.getSeed(roundNum));
}

contract("RaffleParty", accounts => {
  beforeEach(async () => {
    const seederV2 = await TestSeederV2.deployed();
    // Mark seed as ready in 5 minutes (to work around front-running security measures)
    await seederV2.setLastBatchTimestamp(timestamp() + 5 * 60);

    await seederV2.setBatch(0);
    await setSeedForRound(0, 0);
  });

  it("can create raffle", async () => {
    const raffleParty = await RaffleParty.deployed();
    const confetti = await TestConfetti.deployed();
    const party = await TestParty.deployed();
    const rpSeeder = await RpSeeder.deployed();
    const seeder = await TestSeederV2.deployed();

    await confetti.mint(accounts[0], CFTI(30));
    await confetti.approve(RaffleParty.address, CFTI(30), { from: accounts[0] });

    await party.setUserHero(1337);
    await seeder.setBatch(0);
    await rpSeeder.executeRequestMulti();
    await rpSeeder.executeRequestMulti();

    await raffleParty.createRaffle(10, CFTI(1), 5, 10);
  })
})
