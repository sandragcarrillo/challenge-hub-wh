import { gql } from "@apollo/client";

// Fetch all quests with essential fields
export const FETCH_ALL_QUESTS = gql`
  query GetAllQuests($first: Int!, $skip: Int!) {
    questCreateds(first: $first, skip: $skip) {
      id
      _tokenAddress
      _questIndex
      name
      questType
      blockTimestamp
      metadata
      valid
    }
  }
`;

// Fetch detailed information about a specific quest by ID
export const FETCH_QUEST_BY_ID = gql`
  query GetQuestDetails($id: ID!) {
    questCreated(id: $id) {
      id
      _tokenAddress
      _questIndex
      name
      questType
      blockTimestamp
      metadata
      valid
    }
  }
`;

export const FETCH_TOKEN_ADDRESSES = gql`
  query GetTokenAddresses {
    questCreateds(first: 100) {
      id
      _tokenAddress
    }
  }
`;

export const FETCH_QUEST_DETAILS = gql`
  query GetQuestDetails($tokenAddress: String!, $questIndex: Int!) {
    questCreateds(where: { _tokenAddress: $tokenAddress, _questIndex: $questIndex }) {
      id
      _tokenAddress
      _questIndex
      questType
      blockTimestamp
    }
  }
`;
