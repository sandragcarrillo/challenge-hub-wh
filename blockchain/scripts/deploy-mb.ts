import hre from 'hardhat';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

async function main() {
  const signers = await hre.ethers.getSigners();
  const signer = signers[0];

  await hre.mbDeployer.setup();
  const numberOfOptions = 5

  const simpleVoting = await hre.mbDeployer.deploy(signer as SignerWithAddress, 'SimpleVoting', [numberOfOptions], {
    addressLabel: 'simple_voting',
    contractVersion: '1.0',
    contractLabel: 'simple_voting',
  });

  console.log(
    `SimpleVoting with ${numberOfOptions} options deployed to ${simpleVoting.contract.target}`,
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
