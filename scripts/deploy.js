async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const feePercent = 1; 

  const Market = await ethers.getContractFactory("Marketplace");
  const NFXP = await ethers.getContractFactory("NFXP");

  const market = await Market.deploy(feePercent);
  const nfxp = await NFXP.deploy();

  await market.deployed();
  await nfxp.deployed();

  console.log("Marketplace deployed to:", market.address);
  console.log("NFXP deployed to:", nfxp.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
