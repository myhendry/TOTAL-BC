import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

import {
  Demo__factory,
  Demo,
  CallDemo__factory,
  CallDemo,
  AccountFactory,
  AccountFactory__factory,
  V3,
  V3__factory,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("Demo", () => {
  let demo: Demo;
  let callDemo: CallDemo;
  let accountFactory: AccountFactory;
  let v3Factory: V3;
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

    const accountTemplateFactory = (await ethers.getContractFactory(
      "AccountFactory",
      deployer
    )) as AccountFactory__factory;
    accountFactory = await accountTemplateFactory.deploy();
    await accountFactory.deployed();

    const v3TemplateFactory = (await ethers.getContractFactory(
      "V3",
      deployer
    )) as V3__factory;
    v3Factory = await v3TemplateFactory.deploy();
    await v3Factory.deployed();
  });

  describe("V3", async () => {
    it("successfully get chainlink aggregatorV3Interface version", async () => {
      const res = await v3Factory.getV3Version();
      expect(res.toString()).to.be.eq("4");
    });

    it("successfully get chainlink aggregatorV3Interface getLatestRoundData", async () => {
      const res = await demo.getLatestRoundData();
      console.log(res.toString());
      //       const res1 = await v3Factory.getConversionRate(1000000000000000000);
      //       console.log(res1);
      // expect(res.toNumber()).to.be.greaterThan(10000000);
    });

    it("successfully fund with USD", async () => {
      //       const res = await
      // console.log(res.toString());
      // expect(res.toNumber()).to.be.greaterThan(10000000);
    });
  });
});
