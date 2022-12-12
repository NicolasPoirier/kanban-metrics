import axios from "axios";
import { TrelloAction } from "./trello.model";

const ACTIONS_FILTER = [
  "createCard",
  "deleteCard",
  "updateCard:idList",
  "updateCard:closed",
  "copyCard",
  "moveCardFromBoard",
  "moveCardToBoard",
  "convertToCardFromCheckItem",
].join(",");

const ACTION_FIELDS = "data,date,type";

const LIMIT = 1000;

export const createTrelloApi = ({ boardId, key, token }: { boardId: string; key: string; token: string }) => ({
  getCardActions: async (): Promise<TrelloAction[]> => {
    return (
      await axios.get(`https://api.trello.com/1/boards/${boardId}/actions`, {
        params: {
          filter: ACTIONS_FILTER,
          fields: ACTION_FIELDS,
          limit: LIMIT,
          key,
          token,
        },
        headers: { Accept: "application/json", "Accept-Encoding": "identity" },
      })
    ).data;
  },
});
