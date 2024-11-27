"use client";
import { useMemo, useCallback } from "react";
import { Configuration, ContractsApi, EventsApi, ChainsApi } from "@curvegrid/multibaas-sdk";
import { useAccount } from "wagmi";

interface MultiBaasHook {
  createQuest: (params: CreateQuestParams) => Promise<void>;
  getChainStatus: () => Promise<ChainStatus | null>;
}

interface CreateQuestParams {
  name: string;
  hint: string;
  maxWinners: number;
  rewardAmount: number;
  metadata: string; // JSON stringified metadata
  answers: string[]; // List of correct answers to generate Merkle Tree
}

interface ChainStatus {
  chainID: number;
  blockNumber: number;
}

const useMultiBaas = (): MultiBaasHook => {
  const mbBaseUrl = process.env.NEXT_PUBLIC_MULTIBAAS_DEPLOYMENT_URL || "";
  const mbApiKey = process.env.NEXT_PUBLIC_MULTIBAAS_DAPP_USER_API_KEY || "";
  const contractLabel = process.env.NEXT_PUBLIC_MULTIBAAS_CONTRACT_LABEL || "";
  const chain = "base sepolia"; // Ensure this is correct for your deployment

  const mbConfig = useMemo(() => {
    return new Configuration({
      basePath: `${mbBaseUrl}/api/v0`,
      accessToken: mbApiKey,
    });
  }, [mbBaseUrl, mbApiKey]);

  const contractsApi = useMemo(() => new ContractsApi(mbConfig), [mbConfig]);
  const chainsApi = useMemo(() => new ChainsApi(mbConfig), [mbConfig]);

  const { address } = useAccount();

  const getChainStatus = useCallback(async (): Promise<ChainStatus | null> => {
    try {
      const response = await chainsApi.getChainStatus(chain);
      return response.data.result as ChainStatus;
    } catch (error) {
      console.error("Error fetching chain status:", error);
      return null;
    }
  }, [chainsApi, chain]);

  const createQuest = useCallback(async (params: CreateQuestParams): Promise<void> => {
    const { name, hint, maxWinners, rewardAmount, metadata, answers } = params;

    // Generate Merkle Tree
    const keccak256 = require("keccak256");
    const { MerkleTree } = require("merkletreejs");
    const leafNodes = answers.map((answer) => keccak256(answer));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const merkleRoot = `0x${merkleTree.getRoot().toString("hex")}`;
    const merkleBody = JSON.stringify(leafNodes.map((node) => `0x${node.toString("hex")}`));

    try {
      if (!address) throw new Error("Wallet not connected");

      // Payload for MultiBaas
      const payload = {
        args: [
          address,       // _tokenAddress
          name,          // _name
          hint,          // _hint
          maxWinners,    // _maxWinners
          merkleRoot,    // _merkleRoot
          merkleBody,    // _merkleBody
          metadata,      // _metadata
          0,             // _questType (0 for Quiz)
          0,             // _requiredScore
          rewardAmount,  // _rewardAmount
        ],
        from: address,
      };

      await contractsApi.callContractFunction(chain, address, contractLabel, "createQuest", payload);

      console.log("Quest created successfully!");
    } catch (error) {
      console.error("Error creating quest:", error);
      throw new Error("Failed to create quest.");
    }
  }, [contractsApi, address, chain, contractLabel]);

  return {
    createQuest,
    getChainStatus,
  };
};

export default useMultiBaas;
