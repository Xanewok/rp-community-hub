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
    console.log({
      seed: `${await raffleParty.getSeed(10)}`
    })
    await raffleParty.createRaffle(CFTI(1), 5, 10);
  })
})

// contract("RpYieldCollector", (accounts) => {
//   before(async () => {
//     for (const account of accounts.slice(0, 4)) {
//       await mintAndApprove(account, CFTI(1)); // 1 $CFTI
//     }
//   });

//   it("claimMultipleRewardsTo", async () => {
//     const confetti = await TestConfetti.deployed();
//     const raid = await TestRaid.deployed();
//     const collector = await RpYieldCollector.deployed();

//     await raid.setPendingRewards(accounts[0], CFTI(29));
//     await confetti.approve(RpYieldCollector.address, CFTI(30), { from: accounts[0] });
//     await raid.setPendingRewards(accounts[1], CFTI(14));
//     await confetti.approve(RpYieldCollector.address, CFTI(15), { from: accounts[1] });

//     await collector.setFee(0);
//     await collector.authorizeOperator(accounts[0], { from: accounts[1] });
//     await collector.claimMultipleRewardsTo([accounts[0], accounts[1]], accounts[0]);
//     assert.equal(await confetti.balanceOf(RpYieldCollector.address), 0);
//     assert.equal(await confetti.balanceOf(accounts[0]), CFTI(1 + 29 + 14));
//   });
// });

// contract("RpYieldCollector", (accounts) => {
//   it("taxedClaimMultipleRewards", async () => {
//     const confetti = await TestConfetti.deployed();
//     const raid = await TestRaid.deployed();
//     const collector = await RpYieldCollector.deployed();

//     await confetti.mint(accounts[0], CFTI(0.1));
//     await confetti.mint(accounts[1], CFTI(1));

//     await raid.setPendingRewards(accounts[0], CFTI(0));
//     await confetti.approve(RpYieldCollector.address, CFTI(0 + 0.1), { from: accounts[0] });
//     await raid.setPendingRewards(accounts[1], CFTI(14));
//     await confetti.approve(RpYieldCollector.address, CFTI(1 + 14), { from: accounts[1] });

//     await collector.setFee(15);
//     await collector.authorizeOperator(accounts[0], { from: accounts[1] });
//     await collector.taxedClaimMultipleRewards([accounts[0], accounts[1]], 100, accounts[2]);
//     const fee = (0 + 14) * 15 / 10000;
//     const tax = (0 + 14) * 100 / 10000;
//     assert.equal(`${ await confetti.balanceOf(RpYieldCollector.address) }`, CFTI(fee));
//     assert.equal(`${ await confetti.balanceOf(accounts[2]) }`, CFTI(tax));
//     assert.equal(`${ await confetti.balanceOf(accounts[0]) }`, CFTI(0));
//     assert.equal(`${ await confetti.balanceOf(accounts[1]) }`, CFTI(1 + 14 - fee - tax));
//   });
// });

// contract("RpYieldCollector", (accounts) => {
//   it("taxedClaimMultipleRewardsTo", async () => {
//     const confetti = await TestConfetti.deployed();
//     const raid = await TestRaid.deployed();
//     const collector = await RpYieldCollector.deployed();

//     await confetti.mint(accounts[0], CFTI(1));
//     await confetti.mint(accounts[1], CFTI(1));

//     await raid.setPendingRewards(accounts[0], CFTI(29));
//     await confetti.approve(RpYieldCollector.address, CFTI(1 + 29), { from: accounts[0] });
//     await raid.setPendingRewards(accounts[1], CFTI(14));
//     await confetti.approve(RpYieldCollector.address, CFTI(1 + 14), { from: accounts[1] });

//     await collector.setFee(0);
//     await collector.authorizeOperator(accounts[0], { from: accounts[1] });
//     await collector.taxedClaimMultipleRewardsTo([accounts[0], accounts[1]], accounts[1], 100, accounts[2]);
//     assert.equal(`${ await confetti.balanceOf(RpYieldCollector.address) }`, 0);
//     assert.equal(`${ await confetti.balanceOf(accounts[2]) }`, CFTI((29 + 14) / 100))
//     assert.equal(`${ await confetti.balanceOf(accounts[1]) }`, CFTI(1 + (29 + 14) * 99 / 100));
//     assert.equal(`${ await confetti.balanceOf(accounts[0]) }`, CFTI(1));
//   });
// });

// contract("RpYieldCollector", (accounts) => {
//   it("taxedClaimMultipleRewardsTo", async () => {
//     const confetti = await TestConfetti.deployed();
//     const raid = await TestRaid.deployed();
//     const collector = await RpYieldCollector.deployed();

//     await confetti.mint(accounts[0], CFTI(1));
//     await confetti.mint(accounts[1], CFTI(1));

//     await raid.setPendingRewards(accounts[0], CFTI(29));
//     await confetti.approve(RpYieldCollector.address, CFTI(1 + 29), { from: accounts[0] });
//     await raid.setPendingRewards(accounts[1], CFTI(14));
//     await confetti.approve(RpYieldCollector.address, CFTI(1 + 14), { from: accounts[1] });

//     await collector.setFee(25);
//     await collector.authorizeOperator(accounts[0], { from: accounts[1] });
//     await collector.taxedClaimMultipleRewardsTo([accounts[0], accounts[1]], accounts[1], 100, accounts[2]);
//     assert.equal(`${ await confetti.balanceOf(RpYieldCollector.address) }`, CFTI((29 + 14) * 0.0025));
//     assert.equal(`${ await confetti.balanceOf(accounts[2]) }`, CFTI((29 + 14) * 0.01))
//     assert.equal(`${ await confetti.balanceOf(accounts[1]) }`, CFTI(1 + (29 + 14) * 0.9875));
//     assert.equal(`${ await confetti.balanceOf(accounts[0]) }`, CFTI(1));
//   });
// });
