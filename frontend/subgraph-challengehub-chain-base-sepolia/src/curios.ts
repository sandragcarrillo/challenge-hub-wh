import { gql } from "@apollo/client";

export const FETCH_ALL_QUESTS = gql`
  query GetAllQuests {
    questCreateds(first: 100) {
      id
      tokenAddress
      questIndex
      questType
      blockTimestamp
    }
  }
`;

export const FETCH_QUEST_BY_ID = gql`
  query GetQuestById($id: String!) {
    questCreateds(where: { id: $id }) {
      id
      tokenAddress
      questIndex
      questType
      blockTimestamp
    }
  }
`;
