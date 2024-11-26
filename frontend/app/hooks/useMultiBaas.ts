"use client";
import { useCallback, useMemo } from "react";
import { Configuration, ContractsApi, EventsApi } from "@curvegrid/multibaas-sdk";

const useMultiBaas = () => {
  const mbBaseUrl = process.env.NEXT_PUBLIC_MULTIBAAS_DEPLOYMENT_URL || "";
  const mbApiKey = process.env.NEXT_PUBLIC_MULTIBAAS_DAPP_USER_API_KEY || "";
  const curiosContractLabel = process.env.NEXT_PUBLIC_MULTIBAAS_CURIOS_CONTRACT_LABEL || "";
  const curiosAddressLabel = process.env.NEXT_PUBLIC_MULTIBAAS_CURIOS_ADDRESS_LABEL || "";
  const chain = "ethereum";

  const mbConfig = useMemo(() => {
    return new Configuration({
      basePath: new URL("/api/v0", mbBaseUrl).toString(),
      accessToken: mbApiKey,
    });
  }, [mbBaseUrl, mbApiKey]);

  const contractsApi = useMemo(() => new ContractsApi(mbConfig), [mbConfig]);
  const eventsApi = useMemo(() => new EventsApi(mbConfig), [mbConfig]);

  const callContractFunction = useCallback(
    async (methodName: string, args: any[] = []) => {
      try {
        const response = await contractsApi.callContractFunction(
          chain,
          curiosAddressLabel,
          curiosContractLabel,
          methodName,
          { args }
        );
        return response.data.result.kind === "MethodCallResponse"
          ? response.data.result.output
          : response.data.result.tx;
      } catch (err) {
        console.error(`Error calling ${methodName}:`, err);
        throw err;
      }
    },
    [contractsApi, chain, curiosAddressLabel, curiosContractLabel]
  );

  const createQuest = useCallback(
    async (params: any) => {
      return await callContractFunction("createQuest", [
        params.tokenAddress,
        params.name,
        params.hint,
        params.maxWinners,
        params.merkleRoot,
        params.merkleBody,
        params.metadata,
        params.questType,
        params.requiredScore,
        params.rewardAmount,
      ]);
    },
    [callContractFunction]
  );

  const getAllEvents = useCallback(async (): Promise<any[] | null> => {
    try {
      const response = await eventsApi.listEvents(
        undefined, // Start time (opcional)
        undefined, // End time (opcional)
        undefined, // Limit (omitir para traer todos)
        undefined, // Offset
        undefined, // Reverse
        false,     // Fetch only final state events
        chain,     // Blockchain configurada
        undefined, // Sin filtrar por contract_address
        undefined  // Sin filtrar por contract_label
      );
      console.log("Fetched all raw events:", response.data.result);
      return response.data.result;
    } catch (err) {
      console.error("Error fetching all raw events:", err.response?.data || err.message);
      return null;
    }
  }, [eventsApi, chain]);

  const getQuests = useCallback(async (tokenAddress: string) => {
    try {
      const response = await callContractFunction("getQuests", [tokenAddress]);
      return response || [];
    } catch (err) {
      console.error("Error fetching quests:", err);
      return [];
    }
  }, [callContractFunction]);


  const getQuestCreatedEvents = useCallback(async (): Promise<any[]> => {
    try {
      const eventQueryName = "QuestCreated";
  
      const response = await eventsApi.runEventQuery(eventQueryName);
      console.log("Fetched QuestCreated events:", response.data.result);
  
      return response.data.result; // Devuelve los resultados de la consulta
    } catch (err) {
      console.error("Error fetching QuestCreated events via Event Query:", err.response?.data || err.message);
      return [];
    }
  }, [eventsApi]);
  
  

  return {
    createQuest,
    getQuests,
    getAllEvents, 
    getQuestCreatedEvents
  };
};

export default useMultiBaas;
