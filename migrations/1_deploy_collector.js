const RpYieldCollector = artifacts.require("RpYieldCollector");

const TestConfetti = artifacts.require("TestConfetti");
const TestRaid = artifacts.require("TestRaid");

module.exports = async function (deployer, network, accounts) {
  const chainId = await web3.eth.net.getId();
  if (network === 'live' || chainId === 0x1) {
    const confetti = "0xCfef8857E9C80e3440A823971420F7Fa5F62f020";
    const raid = "0xFa209a705a4DA0A240AA355c889ed0995154D7Eb";

    await deployer.deploy(RpYieldCollector, confetti, raid);
  } else {
    let confetti;
    if (chainId === 0x4) {
      confetti = "0x9BEfb9f109ac064e4A3E629528525d3474fcF2c1";
    } else {
      // await deployer.deploy(TestConfetti);
      // confetti = await TestConfetti.address;
    }
    // await deployer.deploy(TestRaid, confetti);
    // await confetti.grantRole(await web3.utils.keccak256("MINTER_ROLE"), TestRaid.address);
    throw new Error(`${await web3.utils.keccak256("MINTER_ROLE")}`);

    await deployer.deploy(RpYieldCollector, confetti, TestRaid.address)
  }
};
