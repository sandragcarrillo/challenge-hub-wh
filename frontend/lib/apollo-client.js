import { ApolloClient, InMemoryCache } from "@apollo/client";


const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/95085/subgraph-challengehub-chain-base-sepolia/version/latest",
  cache: new InMemoryCache(),
});

export default client;
