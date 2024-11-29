import { createBundlerClient, createPaymasterClient } from "viem/account-abstraction";
import { http, createPublicClient } from "viem";
import { baseSepolia } from "viem/chains";

const apiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
const bundlerUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`;

export const publicClient = createPublicClient({
  transport: http("https://sepolia.base.org"),
  chain: baseSepolia,
});

export const bundlerClient = createBundlerClient({
  transport: http(bundlerUrl),
  chain: baseSepolia,
  publicClient,
});

export const paymasterClient = createPaymasterClient({
  transport: http(bundlerUrl),
  chain: baseSepolia,
});
