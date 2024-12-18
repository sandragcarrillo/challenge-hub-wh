# Challenge Hub 

Is a decentralized application (dApp) designed to gamify the learning and engagement process in the communities. 

Participants can solve challenges, validate their solutions using Merkle proofs, and claim rewards directly through the application. The dApp seamlessly integrates Web3 technologies to create a user-friendly interface for both blockchain newbies and experienced users.

The project leverages Ethereum-compatible technologies to manage quests, validate proofs, and distribute rewards in a transparent and decentralized manner. 

# Contracts

- [Curios](https://base-sepolia.blockscout.com/address/0xB6Da7d8996b4510f95fA6704AC7ACAB69CFd51a9?tab=txs)

Deployed using Multibaas by Curvegrid on Base Sepolia.

# Curvegrid Integration

Multibaas was used to deploy the contract and manage the smart contract data on the frontend in certain sections.

# Metamask Delegation Toolkit Integration

The Metamask Delegation Toolkit was employed to enhance user experience by allowing transactions to be signed and executed through delegation. This approach significantly reduced gas costs for end-users and ensured a secure, permissioned workflow.

In this dApp, the delegation was used to submit transactions for quest validation, if the user don't add a correct answer, the transaction uses the delegate account to submit the transaction, if the user adds a correct answer, the transaction is submitted with the user's account.


# Tech Stack

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Solidity](https://soliditylang.org/)
- [Hardhat](https://hardhat.org/)
- [Multibaas by Curvegrid](https://docs.curvegrid.com/multibaas/)
- [Metamask Delegation Toolkit](https://docs.gator.metamask.io/get-started/quickstart)

# Getting Started
To deploy or contribute to Curios Quests, follow these steps:

1. Clone the repository:

```bash

git clone https://github.com/your-repo/curios-quests.git
cd curios-quests
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables: Create a .env file with required keys for Multibaas and Metamask Delegation Toolkit.

```bash
NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID=<YOUR_REOWN_PROJECT_ID
NEXT_PUBLIC_MULTIBAAS_DEPLOYMENT_URL='https://<DEPLOYMENT_ID>.multibaas.com'
NEXT_PUBLIC_MULTIBAAS_DAPP_USER_API_KEY='<YOUR_MULTIBAAS_DAPP_USER_API_KEY>'
NEXT_PUBLIC_MULTIBAAS_WEB3_API_KEY=<YOUR_MULTIBAAS_WEB3_API_KEY>
NEXT_PUBLIC_MULTIBAAS_VOTING_CONTRACT_LABEL=<YOUR_MULTIBAAS_CONTRACT_LABEL>
NEXT_PUBLIC_MULTIBAAS_VOTING_ADDRESS_LABEL=<YOUR_MULTIBAAS_ADDRESS_LABEL>
NEXT_PUBLIC_RPC_URL=<YOUR_RPC_URL>
NEXT_PUBLIC_PIMLICO_API_KEY=<YOUR_PIMLICO_API_KEY>
```

4. Start the development server:

```bash
npm run dev
```

5. Open the dApp in your browser at:

```bash
http://localhost:3000
```
