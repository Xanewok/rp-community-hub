const RaffleParty = artifacts.require("RaffleParty");
const ISeederV2 = artifacts.require("ISeederV2");
const IConfetti = artifacts.require("IConfetti");
const IParty = artifacts.require("IParty");
const IRpSeeder = artifacts.require("IRpSeeder");

const TestConfetti = artifacts.require("TestConfetti");
const TestParty = artifacts.require("TestParty");

module.exports = async function (deployer, network, accounts) {
  const chainId = await web3.eth.net.getId();
  if (chainId == 0x04) {
    // TestConfetti
    IConfetti.address = "0x0B4f94A0a8ad26F3f151AC581ac7156eB04Ab61C";
    // TestSeederV2
    ISeederV2.address = "0xb9a8667C46Ffc9f1eD6e334Af76fcc8b58dD5Bb3";
    // TestParty
    IParty.address = "0x5749066892804Dc9cD8049bd8290EA62C9b711E8";
    // RpSeeder with TestSeederV2 and TestSeedStorage
    IRpSeeder.address = "0xa70d55E48a3a7e83039fd11F00C7D6Caa5b8Bef5";

    RaffleParty.address = "0xB2DAa2fF1f58E1aF2499F65AEfaefb9484C48F34";
    const admin = accounts[0];
    await deployer.deploy(
      RaffleParty,
      IConfetti.address,
      IParty.address,
      ISeederV2.address,
      accounts[0]
    );
  } else if (chainId == 0x01) {
    IConfetti.address = "0xCfef8857E9C80e3440A823971420F7Fa5F62f020";
    ISeederV2.address = "0x2Ed251752DA7F24F33CFbd38438748BB8eeb44e1";
    IParty.address = "0xd311bDACB151b72BddFEE9cBdC414Af22a5E38dc";
    IRpSeeder.address = "0xD9bc167E6C37b29F65E708C4Bb1D299937dFF718";
  }
};
