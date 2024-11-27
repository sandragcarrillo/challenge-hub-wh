"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Web3 from "web3";
import curiosABI from "@/contracts/Curios.sol/Curios.json";
import { FETCH_TOKEN_ADDRESSES } from "@/lib/queries";
import { QuestCard } from "@/app/components/QuestCard";

interface AllQuestsProps {
  contractAddress: string;
  onNavigate: (path: string) => void;
}

export default function AllQuests({ contractAddress, onNavigate }: AllQuestsProps) {
  const [quests, setQuests] = useState<any[]>([]);
  const { data, loading, error } = useQuery(FETCH_TOKEN_ADDRESSES);

  useEffect(() => {
    const fetchQuests = async () => {
      if (!data || !data.questCreateds) {
        console.log("No data from subgraph:", data);
        return;
      }

      try {
        const web3 = new Web3((window as any).ethereum);
        const contract = new web3.eth.Contract(curiosABI.abi, contractAddress);

        // Obtener direcciones únicas desde el subgraph
        const tokenAddresses = Array.from(new Set(data.questCreateds.map((q: any) => q._tokenAddress)));

        console.log("Token Addresses:", tokenAddresses);

        const allQuests: any[] = [];
        for (const address of tokenAddresses) {
          let index = 0;
          while (true) {
            try {
              // Llamar a la función `quests` del contrato para obtener detalles
              const quest = await contract.methods.quests(address, index).call();
              console.log(`Quest fetched for token ${address} at index ${index}:`, quest);

              allQuests.push({
                ...quest,
                tokenAddress: address,
                questIndex: index,
              });

              index++;
            } catch (e) {
              console.log(`No more quests for token ${address} after index ${index - 1}`);
              break; 
            }
          }
        }

        console.log("Fetched Quests:", allQuests);
        setQuests(allQuests);
      } catch (err) {
        console.error("Error fetching quests from contract:", err);
      }
    };

    fetchQuests();
  }, [data, contractAddress]);

  if (loading) return <p>Loading quests...</p>;
  if (error) return <p>Error loading token addresses: {error.message}</p>;
  if (quests.length === 0) return <p>No quests found. Make sure the subgraph is returning data and the contract is properly deployed.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quests.map((quest, index) => (
        <QuestCard
          key={index}
          category={quest.metadata?.category || "Uncategorized"}
          title={quest.name || "Unnamed Quest"}
          reward={quest.rewardAmount ? `${Web3.utils.fromWei(quest.rewardAmount, "ether")} ETH` : "No Reward"}
          isActive={quest.valid}
          onClick={() => onNavigate(`/challenges/${quest.tokenAddress}-${quest.questIndex}`)}/>
      ))}
    </div>
  );
}
