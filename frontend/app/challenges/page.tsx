"use client";

import type { UseWaitForTransactionReceiptReturnType } from "wagmi";
import React, { useState } from "react";
import Voting from "../components/Voting";
import Events from "../components/Events";

const AllChallenges: React.FC = () => {
  const [txReceipt, setTxReceipt] = useState<UseWaitForTransactionReceiptReturnType['data']>();

  return (
    <div>
      <div>
        <Voting setTxReceipt={setTxReceipt} />
        <Events txReceipt={txReceipt} />
      </div>
    </div>
  );
};

export default AllChallenges;