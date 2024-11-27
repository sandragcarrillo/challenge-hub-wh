"use client";

import React from "react";
import AllQuests from "@/app/components/AllQuest";
import { useRouter } from "next/navigation";


const AllQuestsPage = () => {
  const contractAddress = '0xB6Da7d8996b4510f95fA6704AC7ACAB69CFd51a9';
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-neutral-900 text-white p-8">
      <AllQuests contractAddress={contractAddress} onNavigate={handleNavigate} />
    </div>
  );
};

export default AllQuestsPage;
