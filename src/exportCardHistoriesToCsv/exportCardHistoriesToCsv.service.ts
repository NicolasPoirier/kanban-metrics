import fs from "fs";
import { parse } from "json2csv";
import { CardHistory } from "./cardHistory.model";

export type CardHistoryGateway = {
  getCardHistories: () => Promise<CardHistory[]>;
};

export const createExportCardHistoriesToCsvService =
  ({ cardHistoryGateway }: { cardHistoryGateway: CardHistoryGateway }) =>
  async ({ path }: { path: string }) => {
    const cardHistories = await cardHistoryGateway.getCardHistories();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fs.writeFile(path, parse(cardHistories), "utf8", () => {});
  };
