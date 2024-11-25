import hre from 'hardhat';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

async function main() {
  const signers = await hre.ethers.getSigners();
  const signer = signers[0];

  await hre.mbDeployer.setup();

  const curios = await hre.mbDeployer.deploy(signer as SignerWithAddress, 'Curios', [signer.address], {
    addressLabel: 'curios_v1',
    contractVersion: '1.1',
    contractLabel: 'curios',
  });

  console.log(`Curios deployed to ${curios.contract.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});