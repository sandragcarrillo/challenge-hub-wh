"use client";

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import curiosABI from '@/contracts/Curios.sol/Curios.json';



interface ValidateProofProps {
  contractAddress: string;
  questId: string;
}

export default function ValidateProof({ contractAddress, questId }: ValidateProofProps) {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [questDetails, setQuestDetails] = useState<any>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [isWinner, setIsWinner] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  // Split questId into tokenAddress and questIndex
  const [tokenAddress, questIndex] = questId.split("-");

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          setUserAddress(accounts[0]);
          setWeb3(web3Instance);

          // Check if user is already a winner
          if (accounts[0]) {
            const contract = new web3Instance.eth.Contract(curiosABI.abi as any, contractAddress);
            const isWinner = await contract.methods.winners(tokenAddress, questIndex, accounts[0]).call();
            setIsWinner(isWinner);
          }
        } catch (error) {
          console.error("Failed to connect wallet:", error);
          setError('Failed to connect wallet. Please try again.');
        }
      } else {
        setError('Please install MetaMask to validate your proof.');
      }
    };

    initializeWeb3();
  }, [tokenAddress, questIndex, contractAddress]);

  useEffect(() => {
    const fetchQuestDetails = async () => {
      if (web3 && tokenAddress && questIndex) {
        try {
          const contract = new web3.eth.Contract(curiosABI.abi as any, contractAddress);
          const quest = await contract.methods.quests(tokenAddress, questIndex).call();
          console.log("Quest details:", quest);
          setQuestDetails(quest);
        } catch (error) {
          console.error("Error fetching quest details:", error);
          setError('Failed to fetch quest details. Please try again.');
        }
      }
    };

    fetchQuestDetails();
  }, [web3, tokenAddress, questIndex, contractAddress]);

  const toBytes32 = (str: string) => {
    if (!str.startsWith('0x')) {
      str = '0x' + str;
    }
    return Web3.utils.padLeft(str, 64);
  };

  const handleClaimReward = async () => {
    if (!web3 || !userAddress) {
      setError('Wallet not connected');
      return;
    }
    
    setClaimLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const contract = new web3.eth.Contract(curiosABI.abi, contractAddress);
      
      // Get quest details first
      const quest = await contract.methods.quests(tokenAddress, questIndex).call();
      console.log('Quest details before claim:', {
        rewardAmount: web3.utils.fromWei(quest.rewardAmount, 'ether'),
        isValid: quest.valid
      });

      // Check if user is winner
      const isWinner = await contract.methods.winners(tokenAddress, questIndex, userAddress).call();
      console.log('Is user winner?', isWinner);

      if (!isWinner) {
        throw new Error('Not a winner of this quest');
      }

      // Execute claim
      const tx = await contract.methods.claimReward(tokenAddress, questIndex).send({
        from: userAddress
      });
      
      console.log('Claim transaction:', tx);
      setSuccess(`Successfully claimed ${web3.utils.fromWei(quest.rewardAmount, 'ether')} ETH! Transaction: ${tx.transactionHash}`);
      setIsWinner(false);

    } catch (err: any) {
      console.error('Claim error:', err);
      setError(err.message || 'Failed to claim reward');
    } finally {
      setClaimLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!userAddress) throw new Error("User address not found");
      if (!web3) throw new Error("Web3 not initialized");
      if (!questDetails) throw new Error("Quest details not loaded");

      const contract = new web3.eth.Contract(curiosABI.abi as any, contractAddress);

      // Parse merkleBody from quest details
      const merkleBody = JSON.parse(questDetails.merkleBody);
      console.log("Parsed merkleBody:", merkleBody);

      // Generate proof
      const leaf = keccak256(answer);
      const leaves = merkleBody.map((leaf: string) => Buffer.from(leaf.slice(2), 'hex'));
      const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
      const proof = merkleTree.getProof(leaf).map(x => toBytes32(x.data.toString('hex')));

      const tx = await contract.methods.submitProof(
        tokenAddress,
        questIndex,
        proof,
        toBytes32(leaf.toString('hex'))
      ).send({
        from: userAddress,
        gas: 6000000,
        gasPrice: web3.utils.toWei('1', 'gwei'),
      });

      console.log('Transaction result:', tx);
      setSuccess('Proof submitted successfully! You can now claim your reward.');
      setIsWinner(true); // Enable claim button after successful proof
    } catch (err: any) {
      console.error('Detailed error:', err);
      setError('Error: ' + (err.message || 'Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading quest details...</div>;
  }

  if (!questDetails) {
    return <div className="text-center">Loading quest information...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl text-center font-bold mb-4">Validate Your Quest Proof</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{questDetails.name || "Unnamed Quest"}</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-700 font-medium">Hint:</p>
          <p className="text-gray-800">{questDetails.hint || "No hint available"}</p>
        </div>
        {questDetails && (
          <div className="mt-2 text-center">
            <p className="text-green-600 font-medium">
              Reward: {web3?.utils.fromWei(questDetails.rewardAmount, 'ether')} ETH
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label className="text-black font-bold" htmlFor="answer">Your Answer</Label>
          <Input 
            id="answer" 
            name="answer" 
            value={answer} 
            onChange={(e) => setAnswer(e.target.value)} 
            required 
            className="mt-1"
            placeholder="Enter your answer here"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
          disabled={loading}
        >
          {loading ? 'Submitting Proof...' : 'Submit Proof'}
        </Button>
        
        {isWinner && (
          <Button
            type="button"
            onClick={handleClaimReward}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
            disabled={claimLoading}
          >
            {claimLoading ? 'Claiming Reward...' : 'Claim Reward'}
          </Button>
        )}
        
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-500">{success}</p>}
      </form>
    </div>
  );
}