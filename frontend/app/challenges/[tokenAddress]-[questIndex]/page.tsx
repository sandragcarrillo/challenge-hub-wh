"use client";

import React from 'react';
import ValidateProof from '@/app/components/ValidateProof';

interface Props {
  params: { tokenAddress: string; questIndex: string };
}

const QuestPage = ({ params }: Props) => {
  const { tokenAddress, questIndex } = params;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quest Details</h1>
      <ValidateProof
        contractAddress="0xB6Da7d8996b4510f95fA6704AC7ACAB69CFd51a9"
        tokenAddress={tokenAddress}
        questIndex={Number(questIndex)}
      />
    </div>
  );
};

export default QuestPage;
