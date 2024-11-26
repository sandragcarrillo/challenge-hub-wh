"use client";
import React, { useEffect, useState } from "react";
import useMultiBaas from "../hooks/useMultiBaas";

const AllChallenges: React.FC = () => {
  const { getAllEvents } = useMultiBaas();
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [questCreatedEvents, setQuestCreatedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedEvents = await getAllEvents();
        if (fetchedEvents) {
          setAllEvents(fetchedEvents);

          // Filtrar eventos QuestCreated
          const filteredEvents = fetchedEvents.filter(
            (event: any) => event.event.name === "QuestCreated"
          );
          setQuestCreatedEvents(filteredEvents);
        } else {
          setAllEvents([]);
          setQuestCreatedEvents([]);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [getAllEvents]);

  if (loading) return <p>Loading challenges...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Challenges</h1>
      {questCreatedEvents.length > 0 ? (
        <ul className="space-y-4">
          {questCreatedEvents.map((event, index) => (
            <li key={index} className="p-4 border rounded">
              <p><strong>Event Name:</strong> {event.event.name}</p>
              <p><strong>Transaction Hash:</strong> {event.transaction.txHash}</p>
              <p><strong>Triggered At:</strong> {new Date(event.triggeredAt).toLocaleString()}</p>
              <ul>
                {event.event.inputs.map((input: any, idx: number) => (
                  <li key={idx}>
                    <strong>{input.name}:</strong> {input.value}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No challenges found.</p>
      )}
    </div>
  );
};

export default AllChallenges;
