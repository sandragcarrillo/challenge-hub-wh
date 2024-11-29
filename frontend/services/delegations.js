import { DelegationFramework } from "@codefi/delegator-core-viem";
import { encodeFunctionData } from "viem";

export const redeemDelegation = async (delegator, contractAddress, calldata) => {
  try {
    console.log("Redeeming delegation...");

    const redeemCalldata = DelegationFramework.encode.redeemDelegations(
      [[]], // No caveats or restrictions
      ["0x01"], // Single execution mode
      [[{ target: contractAddress, data: calldata, value: 0n }]] // Calls to execute
    );

    console.log("Redeem calldata prepared:", redeemCalldata);
    return redeemCalldata;
  } catch (error) {
    console.error("Error in redeemDelegation:", error);
    throw error;
  }
};
