"use client";

import * as React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";
import {
  getDefaultConfig,
  RainbowKitProvider,
  Chain
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID || '';


const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia.base.org'] },
  },
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: 'Simple Voting DApp',
  projectId,
  chains: [baseSepolia],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <ApolloProvider client={client}>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </ApolloProvider>
  );
}
