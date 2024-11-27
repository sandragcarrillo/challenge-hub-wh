"use client";

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import curiosABI from "@/contracts/Curios.sol/Curios.json";

interface ValidateProofProps {
  contractAddress: string;
  tokenAddress: string;
  questIndex: number;
}

const ValidateProof: React.FC<ValidateProofProps> = ({ contractAddress, tokenAddress, questIndex }) => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [merkleBody, setMerkleBody] = useState<string[]>([]);
  const [hint, setHint] = useState<string>("");

  // Fetch user's address, Merkle body, and hint when the component mounts
  useEffect(() => {
    const loadQuestData = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setUserAddress(accounts[0]);
          } else {
            throw new Error("No accounts found");
          }

          const contract = new web3.eth.Contract(curiosABI.abi, contractAddress);
          const quest = await contract.methods.getQuest(tokenAddress, questIndex).call();
          const parsedMerkleBody = JSON.parse(quest.merkleBody);

          setMerkleBody(parsedMerkleBody);
          setHint(quest.hint); // Load the hint for the quest
        } catch (err) {
          console.error("Failed to load quest data:", err);
          setError("Failed to connect wallet or fetch quest data. Please try again.");
        }
      }
    };
    loadQuestData();
  }, [contractAddress, tokenAddress, questIndex]);

  // Convert a string to a bytes32-compatible format
  const toBytes32 = (str: string) => {
    if (!str.startsWith("0x")) {
      str = "0x" + str;
    }
    return Web3.utils.padLeft(str, 64);
  };

  // Handle proof submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!userAddress) throw new Error("User address not found");

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(curiosABI.abi, contractAddress);

      const leaf = keccak256(answer);
      const leaves = merkleBody.map((leaf) => Buffer.from(leaf, "hex"));
      const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
      const proof = merkleTree.getProof(leaf).map((x) => toBytes32(x.data.toString("hex")));

      await contract.methods
        .submitProof(tokenAddress, questIndex, proof, toBytes32(leaf.toString("hex")))
        .send({ from: userAddress });

      setSuccess("Proof submitted successfully!");
    } catch (err: any) {
      console.error("Error submitting proof:", err);
      setError("Error submitting proof: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold mb-4">Validate Your Quest</h1>
      {hint && <p className="text-gray-700 font-semibold mb-4">Hint: {hint}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label className="text-black font-bold" htmlFor="answer">
            Your Answer
          </Label>
          <Input
            id="answer"
            name="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            className="mt-2"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded"
          disabled={loading || !merkleBody.length}
        >
          {loading ? "Submitting Proof..." : "Submit Proof"}
        </Button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {success && <p className="mt-4 text-green-500">{success}</p>}
    </div>
  );
};

export default ValidateProof;
