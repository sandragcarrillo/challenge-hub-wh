"use client";

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import curiosABI from "@/contracts/Curios.sol/Curios.json"; 

const contractAddress = "0xB6Da7d8996b4510f95fA6704AC7ACAB69CFd51a9";

const CreateQuestForm = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    hint: "",
    maxWinners: 0,
    rewardAmount: "", 
    metadata: "",
    questType: "Quiz", 
    requiredScore: 0,
    answers: [""], 
  });

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();
          setWeb3(web3Instance);
          setUserAddress(accounts[0]);
        } catch (err) {
          console.error("Failed to load web3 or accounts:", err);
        }
      } else {
        console.error("MetaMask not detected");
      }
    };
    loadWeb3();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding/removing answers for the Merkle tree
  const addAnswer = () => {
    setFormData((prev) => ({ ...prev, answers: [...prev.answers, ""] }));
  };

  const removeAnswer = (index: number) => {
    const newAnswers = [...formData.answers];
    newAnswers.splice(index, 1);
    setFormData((prev) => ({ ...prev, answers: newAnswers }));
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...formData.answers];
    newAnswers[index] = value;
    setFormData((prev) => ({ ...prev, answers: newAnswers }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!web3 || !userAddress) throw new Error("Web3 or wallet not initialized");

      const contract = new web3.eth.Contract(curiosABI.abi as any, contractAddress);

      // Convert reward amount to Wei
      const rewardAmountWei = web3.utils.toWei(formData.rewardAmount, "ether");
      const totalRewardWei = BigInt(rewardAmountWei) * BigInt(formData.maxWinners);

      console.log('Creating quest with:', {
        rewardPerWinner: formData.rewardAmount + ' ETH',
        maxWinners: formData.maxWinners,
        totalReward: web3.utils.fromWei(totalRewardWei.toString(), 'ether') + ' ETH'
      });

      // Generate Merkle Tree
      const leafNodes = formData.answers.map((answer) => keccak256(answer));
      const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
      const merkleRoot = `0x${merkleTree.getRoot().toString("hex")}`;
      const merkleBody = JSON.stringify(leafNodes.map((node) => `0x${node.toString("hex")}`));

      const questType = formData.questType === "Quiz" ? 0 : 1;

      const metadata = JSON.stringify({
        name: formData.name,
        reward: formData.rewardAmount,
        category: formData.questType,
        otherDetails: formData.metadata,
      });

      // Call createQuest function
      await contract.methods
        .createQuest(
          userAddress,
          formData.name,
          formData.hint,
          formData.maxWinners,
          merkleRoot,
          merkleBody,
          metadata,
          questType,
          formData.requiredScore,
          rewardAmountWei
        )
        .send({
          from: userAddress,
          value: totalRewardWei.toString(), // Send the total ETH needed for all winners
        });

      setSuccess("Quest created successfully!");
      setFormData({
        name: "",
        hint: "",
        maxWinners: 0,
        rewardAmount: "",
        metadata: "",
        questType: "Quiz",
        requiredScore: 0,
        answers: [""],
      });
    } catch (err: any) {
      console.error("Error creating quest:", err);
      setError(err.message || "Error creating quest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold">Create a New Quest</h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Quest Name"
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        name="hint"
        value={formData.hint}
        onChange={handleInputChange}
        placeholder="Quest Hint"
        className="w-full p-2 border rounded"
        required
      ></textarea>

      <input
        type="number"
        name="maxWinners"
        value={formData.maxWinners}
        onChange={handleInputChange}
        placeholder="Max Winners"
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="rewardAmount"
        value={formData.rewardAmount}
        onChange={handleInputChange}
        placeholder="Reward Amount (ETH)"
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        name="metadata"
        value={formData.metadata}
        onChange={handleInputChange}
        placeholder="Additional Metadata (JSON)"
        className="w-full p-2 border rounded"
      ></textarea>

      <select
        name="questType"
        value={formData.questType}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="Quiz">Quiz</option>
        <option value="Game">Game</option>
      </select>

      {formData.questType === "Game" && (
        <input
          type="number"
          name="requiredScore"
          value={formData.requiredScore}
          onChange={handleInputChange}
          placeholder="Required Score (for Game quests)"
          className="w-full p-2 border rounded"
        />
      )}

      {formData.questType === "Quiz" && (
        <>
          <h3 className="text-lg font-bold">Answers</h3>
          {formData.answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Answer ${index + 1}`}
                className="w-full p-2 border rounded"
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeAnswer(index)}
                  className="p-2 bg-red-600 text-white rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addAnswer} className="p-2 bg-blue-600 text-white rounded">
            Add Answer
          </button>
        </>
      )}

      <button
        type="submit"
        className="w-full p-2 bg-green-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Quest"}
      </button>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </form>
  );
};

export default CreateQuestForm;
