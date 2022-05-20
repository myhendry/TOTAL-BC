import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

import { Demo__factory, Demo, CallDemo__factory, CallDemo } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("Demo", () => {
  let demo: Demo;
  let callDemo: CallDemo;
  let deployer: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async () => {
    // 1
    const accounts = await ethers.getSigners();
    [deployer, user2] = accounts;

    // 2
    const demoFactory = (await ethers.getContractFactory(
      "Demo",
      deployer
    )) as Demo__factory;
    demo = await demoFactory.deploy();
    await demo.deployed();

    const callDemoFactory = (await ethers.getContractFactory(
      "CallDemo",
      deployer
    )) as CallDemo__factory;
    callDemo = await callDemoFactory.deploy();
    await callDemo.deployed();

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

      tx = await deployer.sendTransaction({
        to: demo.address,
        value: ethers.utils.parseEther("0.2"),
      });
      await tx.wait();
      const demoBalance = await demo.getBalance();
      const balanceInEth = ethers.utils.formatEther(demoBalance.toString());
      expect(balanceInEth).to.eq("0.2");

      const signerBalance = await deployer.getBalance();
      const signerBalanceInEth = ethers.utils.formatEther(
        signerBalance.toString()
      );
      expect(parseInt(signerBalanceInEth)).to.be.lessThan(10_000);
    });

    it("successfully Deposit and Withdraw 0.1 Eth from Demo Contract", async () => {
      let tx;

      // Fund or Deposit Demo Contract with 0.2 Eth
      tx = await deployer.sendTransaction({
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

  describe("test call other contract function", async () => {
    it("call setName and getName functions successfully in CallDemo", async () => {
      let name = await callDemo.getName(demo.address);
      expect(name).to.be.eq("hendry");
      await callDemo.setName(demo.address, "steve");
      name = await callDemo.getName(demo.address);
      expect(name).to.be.eq("steve");
    });
  });

  describe("Interfaces", async () => {
    it("interfaces", async () => {
      const res = await demo.getTokenReserves();
      console.log(res[0].toString(), res[1].toString());
    });
  });
});
