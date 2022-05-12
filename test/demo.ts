import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

import { Demo__factory, Demo } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("Demo", () => {
  let demo: Demo;
  let signers: SignerWithAddress[];

  beforeEach(async () => {
    // 1
    signers = await ethers.getSigners();

    // 2
    const demoFactory = (await ethers.getContractFactory(
      "Demo",
      signers[0]
    )) as Demo__factory;
    demo = await demoFactory.deploy();
    await demo.deployed();

    // 3
    const initialName = await demo.getName();
    expect(initialName).to.eq("hendry");
    expect(demo.address).to.properAddress;
  });

  // 4
  describe("check name", async () => {
    it("name should be hendry", async () => {
      let name = await demo.getName();
      expect(name).to.eq("hendry");
    });

    it("name should be hello world", async () => {
      await demo.setName("hello world");
      let name = await demo.getName();
      expect(name).to.eq("hello world");
    });
  });

  describe("test deposit and withdraw function", async () => {
    it("successfully deposit 0.2 Eth into Demo Contract", async () => {
      let tx; // https://stackoverflow.com/questions/70677788/when-is-tx-wait1-required

      tx = await signers[0].sendTransaction({
        to: demo.address,
        value: ethers.utils.parseEther("0.2"),
      });
      await tx.wait();
      const demoBalance = await demo.getBalance();
      const balanceInEth = ethers.utils.formatEther(demoBalance.toString());
      expect(balanceInEth).to.eq("0.2");

      const signerBalance = await signers[0].getBalance();
      const signerBalanceInEth = ethers.utils.formatEther(
        signerBalance.toString()
      );
      expect(parseInt(signerBalanceInEth)).to.be.lessThan(10_000);
    });

    it("successfully withdraw 0.1 Eth from Demo Contract", async () => {
      let tx;

      // Fund Demo Contract with 0.2 Eth
      tx = await signers[0].sendTransaction({
        to: demo.address,
        value: ethers.utils.parseEther("0.2"),
      });
      await tx.wait();

      // Get Current Demo Contract Balance in Eth
      let demoBalance = await demo.getBalance();
      let balanceInEth = ethers.utils.formatEther(demoBalance.toString());

      // Withdraw 0.1 Eth from Demo Contract
      await demo.withdraw(ethers.utils.parseEther("0.1"));

      // Get New Demo Contract Balance in Eth
      demoBalance = await demo.getBalance();
      balanceInEth = ethers.utils.formatEther(demoBalance.toString());
      expect(balanceInEth).to.eq("0.1");
    });
  });
});
