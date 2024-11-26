"use client";
import React, { useEffect, useState, useCallback } from "react";
import useMultiBaas from "../hooks/useMultiBaas";

interface EventInput {
  name: string;
  type: string;
  value: string;
}

interface EventData {
  event: {
    name: string;
    inputs: EventInput[];
  };
  triggeredAt: string;
  transaction: {
    txHash: string;
  };
}

const AllChallenges: React.FC = () => {
  const { getChallengeCreatedEvents } = useMultiBaas(); // Asegúrate de definir esto en useMultiBaas
  const [challenges, setChallenges] = useState<EventData[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch challenge creation events
  const fetchChallenges = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      // Llama al método del hook para obtener los eventos QuestCreated
      const fetchedEvents = await getChallengeCreatedEvents();
      if (fetchedEvents) {
        setChallenges(fetchedEvents);
      }
    } catch (err) {
      console.error("Error fetching challenges:", err);
      setError("Failed to fetch challenges. Please try again later.");
    } finally {
      setIsFetching(false);
    }
  }, [getChallengeCreatedEvents]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Challenges</h1>

      {isFetching ? (
        <p>Loading challenges...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : challenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h2 className="font-bold text-lg">{challenge.event.name}</h2>
              <p><strong>Triggered At:</strong> {challenge.triggeredAt}</p>
              {challenge.event.inputs.map((input, idx) => (
                <p key={idx}>
                  <strong>{input.name}:</strong> {input.value}
                </p>
              ))}
              <p>
                <strong>Transaction Hash:</strong> {challenge.transaction.txHash}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No challenges found.</p>
      )}
    </div>
  );
};

export default AllChallenges;
