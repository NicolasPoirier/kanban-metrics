import { CardHistory } from "../exportCardHistoriesToCsv/cardHistory.model";
import { transformTrelloActionsToCardHistories, TrelloAction } from "./trello.model";

export type TrelloApi = { getCardActions: () => Promise<TrelloAction[]> };

export const createGetTrelloCardHistoriesService = ({
  listNameMapping,
  trelloApi,
}: {
  listNameMapping: Record<string, string>;
  trelloApi: TrelloApi;
}) => ({
  getCardHistories: async (): Promise<CardHistory[]> => {
    const trelloActions = await trelloApi.getCardActions();
    return transformTrelloActionsToCardHistories({ listNameMapping, trelloActions });
  },
});
