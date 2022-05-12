import { ethers } from "hardhat";

async function main() {
  const networkId = await (await ethers.provider.getNetwork()).chainId;

  const accounts = await ethers.getSigners();

  console.log(
    "Accounts:",
    accounts.map((a) => a.address)
  );

  const counterFactory = await ethers.getContractFactory("Counter");
  // If we had constructor arguments, they would be passed into deploy()
  let counterContract = await counterFactory.deploy();
  await counterContract.deployed();
  console.log(
    `Counter Mined! Counter Contract is at ${counterContract.address}`
  );

  const demoFactory = await ethers.getContractFactory("Demo");
  // If we had constructor arguments, they would be passed into deploy()
  let demoContract = await demoFactory.deploy();
  await demoContract.deployed();
  console.log(`Demo Mined! Demo Address is at ${demoContract.address}`);

  // const nftMarketplaceFactory = await ethers.getContractFactory(
  //   "NFTMarketplace"
  // );
  // // If we had constructor arguments, they would be passed into deploy()
  // let nftMarketplaceContract = await nftMarketplaceFactory.deploy();
  // await nftMarketplaceContract.deployed();
  // console.log("NFTMarketplace Mined!");

  let config = `
  // Last Deployed on ${networkId} network
  export const counterContractAddress = "${counterContract.address}"
  export const demoContractAddress = "${demoContract.address}"

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
