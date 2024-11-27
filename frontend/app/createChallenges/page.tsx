"use client";

import CreateQuest from "@/app/components/createQuestForm";
import { useState } from "react";

const TransactionStatus: React.FC<{ txReceipt: any }> = ({ txReceipt }) => {
  if (!txReceipt) return null;

  return (
    <div className="transaction-status bg-gray-800 text-white p-4 rounded-lg mt-4">
      <h2 className="text-lg font-bold">Transaction Status</h2>
      <p>
        <strong>Transaction Hash:</strong> {txReceipt.transactionHash}
      </p>
      <p>
        <strong>Block Number:</strong> {txReceipt.blockNumber}
      </p>
      <p>
        <strong>From:</strong> {txReceipt.from}
      </p>
      <p>
        <strong>To:</strong> {txReceipt.to}
      </p>
    </div>
  );
};

const App: React.FC = () => {
  const [txReceipt, setTxReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuestCreated = async () => {
    setTxReceipt(null);
    setLoading(true);
    setError(null);
    try {
      // Simulating a success callback for quest creation
      const receipt = await new Promise((resolve) =>
        setTimeout(() => resolve({ transactionHash: "0x123...", blockNumber: 12345, from: "0xabc", to: "0xdef" }), 2000)
      );
      setTxReceipt(receipt);
    } catch (err: any) {
      setError("Failed to create the quest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create a New Quest</h1>
      <CreateQuest onQuestCreated={handleQuestCreated} />
      {loading && (
        <p className="loading mt-4 text-yellow-400">Submitting transaction...</p>
      )}
      {error && (
        <p className="error mt-4 text-red-500">{error}</p>
      )}
      <TransactionStatus txReceipt={txReceipt} />
    </div>
  );
};

export default App;