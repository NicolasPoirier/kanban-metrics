import { createExportCardHistoriesToCsvService } from "./exportCardHistoriesToCsv.service";
import { createTrelloApi } from "../trello/trello.api";
import { createGetTrelloCardHistoriesService } from "../trello/trelloBoard.service";
import expect from "node:assert";

expect(process.env.LIST_NAMES, "Env var LIST_NAMES not set");
expect(process.env.TRELLO_BOARD_ID, "Env var TRELLO_BOARD_ID not set");
expect(process.env.TRELLO_KEY, "Env var TRELLO_KEY not set");
expect(process.env.TRELLO_TOKEN, "Env var TRELLO_TOKEN not set");

const listNameMapping: Record<string, string> = JSON.parse(process.env.LIST_NAMES);
const boardId = process.env.TRELLO_BOARD_ID;
const key = process.env.TRELLO_KEY;
const token = process.env.TRELLO_TOKEN;

const path = process.argv[2];

const trelloApi = createTrelloApi({ boardId, key, token });
const cardHistoryGateway = createGetTrelloCardHistoriesService({ listNameMapping, trelloApi });

const exportCardHistoriesToCsv = createExportCardHistoriesToCsvService({ cardHistoryGateway });

exportCardHistoriesToCsv({ path });
