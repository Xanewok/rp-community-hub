const assert = require("assert");

const TestConfetti = artifacts.require("TestConfetti");
const TestRaid = artifacts.require("TestRaid");
const RpYieldCollector = artifacts.require("RpYieldCollector");

async function mintAndApprove(address, amount) {
  const confetti = await TestConfetti.deployed();
  await confetti.burn(await confetti.balanceOf(address), { from: address });
  await confetti.mint(address, amount);
  await confetti.approve(RpYieldCollector.address, amount, { from: address });
}

const cfti = (num) => `${num}000000000000000000`;

contract("RpYieldCollector", (accounts) => {
  before(async () => {
    for (const account of accounts.slice(0, 4)) {
      await mintAndApprove(account, cfti(1)); // 1 $CFTI
    }
  });

  it("claimMultipleRewardsTo", async () => {
    const confetti = await TestConfetti.deployed();
    const raid = await TestRaid.deployed();
    const collector = await RpYieldCollector.deployed();

    await raid.setPendingRewards(accounts[0], cfti(29));
    await confetti.approve(RpYieldCollector.address, cfti(30), { from: accounts[0] });
    await raid.setPendingRewards(accounts[1], cfti(14));
    await confetti.approve(RpYieldCollector.address, cfti(15), { from: accounts[1] });

    await collector.claimMultipleRewardsTo([accounts[0], accounts[1]], accounts[0]);
    assert.equal(await confetti.balanceOf(RpYieldCollector.address), 0);
    assert.equal(await confetti.balanceOf(accounts[0]), cfti(1 + 29 + 14));
  });
});

contract("RpYieldCollector", (accounts) => {
  before(async () => {
    for (const account of accounts.slice(0, 4)) {
      await mintAndApprove(account, cfti(1)); // 1 $CFTI
    }
  });

  it("taxedClaimMultipleRewardsTo", async () => {
    const confetti = await TestConfetti.deployed();
    const raid = await TestRaid.deployed();
    const collector = await RpYieldCollector.deployed();

    await raid.setPendingRewards(accounts[0], cfti(29));
    await confetti.approve(RpYieldCollector.address, cfti(30), { from: accounts[0] });
    await raid.setPendingRewards(accounts[1], cfti(14));
    await confetti.approve(RpYieldCollector.address, cfti(15), { from: accounts[1] });

    await collector.taxedClaimMultipleRewardsTo([accounts[0], accounts[1]], accounts[1], 1000, accounts[2]);
    assert.equal(`${await confetti.balanceOf(RpYieldCollector.address)}`, 0);
    assert.equal(`${await confetti.balanceOf(accounts[2])}`, cfti((1+ 29 + 14) / 10))
    assert.equal(`${await confetti.balanceOf(accounts[1])}`, cfti((1+ 29 + 14) * 9 / 10));
  });
});
