import { createPublicClient, http } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { bundlerClient, paymasterClient } from "./pimlicoClient";
import { encodeFunctionData } from "viem";
import curiosABI from "@/contracts/Curios.sol/Curios.json";

const publicClient = createPublicClient({ transport: http("https://sepolia.base.org") });

export const createDelegatorAccount = async () => {
  try {
    console.log("Creating delegator account...");
    const privateKey = generatePrivateKey();
    const owner = privateKeyToAccount(privateKey);

    const delegatorAccount = {
      address: owner.address,
      signUserOperation: async (userOperation) => {
        return { ...userOperation, signature: "0x123456" }; // Simula la firma
      },
    };

    console.log("Delegator account created:", delegatorAccount);
    return delegatorAccount;
  } catch (error) {
    console.error("Error creating delegator account:", error);
    throw error;
  }
};

export const sendProofWithDelegator = async (
    delegator,
    proof,
    questIndex,
    contractAddress,
    tokenAddress,
    answer // Este será directamente el input
  ) => {
    try {
      console.log("Sending proof with delegator...");
      console.log("Proof:", proof);
      console.log("Quest index:", questIndex);
      console.log("Contract address:", contractAddress);
      console.log("Answer:", answer);
  
      if (!proof || proof.length === 0) {
        throw new Error("Proof is empty. Cannot submit proof.");
      }
  
      // Verifica que el answer sea un bytes32 válido
      const answerBytes32 = `0x${answer.padStart(64, "0")}`;
      if (answerBytes32.length !== 66) {
        throw new Error("Answer must be a valid bytes32 value.");
      }
  
      // Codifica los datos de la función
      const calldata = encodeFunctionData({
        abi: curiosABI.abi,
        functionName: "submitProof",
        args: [tokenAddress, questIndex, proof, answerBytes32],
      });
  
      console.log("Encoded calldata:", calldata);
  
      // Envía la operación al contrato con la cuenta delegada
      const userOpHash = await delegator.sendUserOperation({
        callData: calldata,
      });
  
      console.log("User operation hash:", userOpHash);
      return userOpHash;
    } catch (error) {
      console.error("Error sending proof with delegator account:", error);
      throw error;
    }
  };