import { CardHistory, TRASH_LIST } from "../exportCardHistoriesToCsv/cardHistory.model";

type TrelloList = {
  id: string;
};

type TrelloCard = {
  id: string;
  name: string;
  closed?: boolean;
};

type ActionType =
  | "createCard"
  | "updateCard"
  | "copyCard"
  | "moveCardToBoard"
  | "convertToCardFromCheckItem"
  | "deleteCard"
  | "moveCardFromBoard";

type DataBase = {
  card: TrelloCard;
};

type DataWithList = DataBase & {
  list: TrelloList;
  listAfter?: never;
};

type DataWithListAfter = DataBase & {
  listAfter: TrelloList;
  list?: never;
};

type Data = DataWithList | DataWithListAfter;

export type TrelloAction = {
  type: ActionType;
  date: string;
  data: Data;
};

export const transformTrelloActionsToCardHistories = ({
  listNameMapping,
  trelloActions,
}: {
  listNameMapping: Record<string, string>;
  trelloActions: TrelloAction[];
}): CardHistory[] => {
  return trelloActions
    .filter((trelloAction) => isTrelloActionToKeep({ listNameMapping, trelloAction }))
    .map((trelloAction) => transformTrelloActionToCardHistory({ listNameMapping, trelloAction }));
};

const transformTrelloActionToCardHistory = ({
  listNameMapping,
  trelloAction,
}: {
  listNameMapping: Record<string, string>;
  trelloAction: TrelloAction;
}): CardHistory => {
  const listId = getListId({ trelloAction });
  return {
    cardId: trelloAction.data.card.id,
    cardName: trelloAction.data.card.name,
    listId,
    listName: listNameMapping[listId],
    date: trelloAction.date,
  };
};

const getListId = ({ trelloAction }: { trelloAction: TrelloAction }) => {
  if (isLeavingBoard({ trelloAction })) {
    return TRASH_LIST;
  }

  if (trelloAction.data.list) {
    return trelloAction.data.list.id;
  } else {
    return trelloAction.data.listAfter.id;
  }
};

const LEAVING_BOARD_ACTION_TYPES = ["deleteCard", "moveCardFromBoard"];

const isLeavingBoard = ({ trelloAction }: { trelloAction: TrelloAction }) => {
  return LEAVING_BOARD_ACTION_TYPES.includes(trelloAction.type) || trelloAction.data.card.closed;
};

const isTrelloActionToKeep = ({
  listNameMapping,
  trelloAction,
}: {
  listNameMapping: Record<string, string>;
  trelloAction: TrelloAction;
}) => {
  const listId = getListId({ trelloAction });
  return Object.keys(listNameMapping).includes(listId);
};
