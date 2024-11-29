"use client";

import React from "react";
import { useParams } from "next/navigation";
import ValidateProof from "@/app/components/ValidateProof";

const QuestPage = () => {
  const params = useParams();
  
  // Get the combined parameter and split it
  const combinedParam = params?.["tokenAddress]-[questIndex"];
  console.log("Combined param:", combinedParam);

  // Split the combined parameter into tokenAddress and questIndex
  const [tokenAddress, questIndex] = combinedParam ? combinedParam.split("-") : [null, null];

  console.log("Parsed values:", {
    tokenAddress,
    questIndex,
    paramsType: {
      tokenAddress: typeof tokenAddress,
      questIndex: typeof questIndex
    }
  });

  if (!tokenAddress || !questIndex) {
    return (
      <div className="container mx-auto p-6">
        <p>Invalid parameters</p>
        <p>Debug info:</p>
        <pre>{JSON.stringify({ params, tokenAddress, questIndex }, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quest Details</h1>
      <ValidateProof
        contractAddress="0xB6Da7d8996b4510f95fA6704AC7ACAB69CFd51a9"
        questId={`${tokenAddress}-${questIndex}`}
      />
    </div>
  );
};

export default QuestPage;
