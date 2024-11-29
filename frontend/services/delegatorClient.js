import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { encodeFunctionData } from "viem";
import curiosABI from "@/contracts/Curios.sol/Curios.json";
import { bundlerClient, paymasterClient } from "@/services/pimlicoClient";


export const createDelegatorAccount = async () => {
  try {
    console.log("Creating delegator account...");
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);

    const delegatorAccount = {
      address: account.address,
      privateKey,
      async signUserOperation(userOperation) {
        const signedOperation = await account.signMessage(userOperation.callData);
        return { ...userOperation, signature: signedOperation };
      },
    };

    console.log("Delegator account created:", delegatorAccount);
    return delegatorAccount;
  } catch (error) {
    console.error("Error creating delegator account:", error);
    throw error;
  }
};

/**
 * Submit proof with a delegator
 */
export const sendProofWithDelegator = async (
  delegator,
  proof,
  questIndex,
  contractAddress,
  tokenAddress,
  answer
) => {
  try {
    console.log("Sending proof with delegator...");
    console.log("Proof:", proof);
    console.log("Quest index:", questIndex);
    console.log("Contract address:", contractAddress);
    console.log("Answer:", answer);

    // Ensure proof is not empty
    if (!proof || proof.length === 0) {
      throw new Error("Invalid answer, come back later with the valid answer");
    }

    // Ensure answer is a valid bytes32
    const answerBytes32 = `0x${answer.padStart(64, "0")}`;
    if (answerBytes32.length !== 66) {
      throw new Error("Answer must be a valid bytes32 value.");
    }

    // Encode function data
    const calldata = encodeFunctionData({
      abi: curiosABI.abi,
      functionName: "submitProof",
      args: [tokenAddress, questIndex, proof, answerBytes32],
    });

    console.log("Encoded calldata:", calldata);

    // Prepare user operation
    const userOperation = {
      sender: delegator.address,
      callData: calldata,
      verificationGasLimit: "2000000",
      preVerificationGas: "50000",
      maxFeePerGas: "1000000000",
      maxPriorityFeePerGas: "100000000",
    };

    // Estimate gas using the bundler
    const gasEstimate = await bundlerClient.estimateUserOperationGas({
      userOperation,
    });
    console.log("Gas estimate:", gasEstimate);

    // Sponsor gas with paymaster
    const sponsorship = await paymasterClient.sponsorUserOperation({
      userOperation,
    });

    const signedUserOperation = await delegator.signUserOperation({
      ...userOperation,
      ...sponsorship,
    });

    console.log("Submitting signed user operation...");
    const userOpHash = await bundlerClient.sendUserOperation({
      userOperation: signedUserOperation,
    });

    console.log("Waiting for operation receipt...");
    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
      timeout: 30000,
    });

    if (!receipt.success) {
      throw new Error(`User operation failed: ${receipt.reason}`);
    }

    console.log("User operation successful:", receipt);
    return receipt;
  } catch (error) {
    console.error("Error sending proof with delegator account:", error);
    throw error;
  }
};
