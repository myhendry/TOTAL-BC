import { ethers } from "hardhat";

async function main() {
  // https://github.com/myhendry/LAB/blob/main/blockchain/demo/scripts/deploy.ts

  // https://ethereum.stackexchange.com/questions/122157/hardhat-stuck-testing-in-mainnet-by-default
  //* NETWORK
  const network = await ethers.provider.getNetwork();
  console.log(
    `You are Deploying on Network Name ${network.name}. The NetworkId is ${network.chainId} \n`
  );

  //* ACCOUNTS
  const [deployer, payer1] = await ethers.getSigners();
  console.log(
    `Deployer account address is ${deployer.address} and Payer1 account address is ${payer1.address} \n`
  );

  //* CONTRACTS
  let counterAddress;
  let demoAddress;
  let callDemoAddress;

  //* CUSTOM CONTRACTS
  const counterFactory = await ethers.getContractFactory("Counter");
  // If we had constructor arguments, they would be passed into deploy()
  let counterContract = await counterFactory.deploy();
  await counterContract.deployed();
  counterAddress = counterContract.address;
  console.log(`Counter Mined! Counter Contract is at ${counterAddress} \n`);

  const demoFactory = await ethers.getContractFactory("Demo");
  let demoContract = await demoFactory.deploy();
  await demoContract.deployed();
  demoAddress = demoContract.address;
  console.log(`Demo Mined! Demo Address is at ${demoAddress} \n`);

  const callDemoFactory = await ethers.getContractFactory("CallDemo");
  let callDemoContract = await callDemoFactory.deploy();
  await callDemoContract.deployed();
  callDemoAddress = callDemoContract.address;
  console.log(`CallDemo Mined! CallDemo Address is at ${callDemoAddress} \n`);

  // // const nftMarketplaceFactory = await ethers.getContractFactory(
  // //   "NFTMarketplace"
  // // );
  // // // If we had constructor arguments, they would be passed into deploy()
  // // let nftMarketplaceContract = await nftMarketplaceFactory.deploy();
  // // await nftMarketplaceContract.deployed();
  // // console.log("NFTMarketplace Mined!");

  console.log(`The contract addresses are as follow: \n
  counterContractAddress: ${counterAddress}, \n
  demoContractAddress: ${demoAddress}, \n
  callDemoContractAddress: ${callDemoAddress} \n 
  `);

  let config = `
  // Last Deployed on ${network.name} network
  export const counterContractAddress = "${counterAddress}"
  export const demoContractAddress = "${demoAddress}"
  export const callDemoContractAddress = "${callDemoAddress}"
  `;

  writeAddressToFrontend(config);

  let startDir = __dirname + "/../typechain";
  let endDir = __dirname + "/../../web/typechain";
  copyFolderRecursiveSync(startDir, endDir);
}

const writeAddressToFrontend = (config: string) => {
  const fs = require("fs");

  const contractsDir = __dirname + "/../../web/config";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  let data = JSON.stringify(config);

  fs.writeFileSync(contractsDir + "/contract-address.ts", JSON.parse(data));
};

const copyFileSync = (source: string, target: string) => {
  const fs = require("fs");
  const path = require("path");

  let targetFile = target;

  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
};

const copyFolderRecursiveSync = (
  source: string,
  target: string,
  isRoot: boolean = true
) => {
  const fs = require("fs");
  const path = require("path");

  let files = [];

  let targetFolder = isRoot ? target : path.join(target, path.basename(source));
  //console.log("target folder", targetFolder);

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file: any) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder, false);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
