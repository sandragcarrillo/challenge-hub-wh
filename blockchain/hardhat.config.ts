import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-multibaas-plugin';
import path from 'path';

let deployerPrivateKey = '0x0000000000000000000000000000000000000000000000000000000000000000';
let deploymentEndpoint, ethChainID, adminApiKey, rpcUrl = '';

if (process.env.HARDHAT_NETWORK) {
  const CONFIG_FILE = path.join(__dirname, `./deployment-config.development.js`);
  ({
    deploymentConfig: { deploymentEndpoint, ethChainID, deployerPrivateKey, adminApiKey, rpcUrl },
  } = require(CONFIG_FILE));
}

const config: HardhatUserConfig = {
  networks: {
    development: {
      url: rpcUrl,
      chainId: ethChainID,
      accounts: [deployerPrivateKey],
    }
  },
  mbConfig: {
    apiKey: adminApiKey,
    host: deploymentEndpoint,
    allowUpdateAddress: ['base_sepolia'],
    allowUpdateContract: ['base_sepolia'],
  },
  solidity: {
    compilers: [
      {
        version: '0.8.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
          evmVersion: 'paris', // until PUSH0 opcode is widely supported
        },
      },
    ],
  },
};

export default config;
