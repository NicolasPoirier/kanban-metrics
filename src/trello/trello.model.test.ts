import { expect } from "chai";
import { TRASH_LIST } from "../exportCardHistoriesToCsv/cardHistory.model";
import { transformTrelloActionsToCardHistories } from "./trello.model";

describe("Transform Trello actions to card history. List name comes from a lookup table id => name", () => {
  it("No Trello actions is transformed to an empty array", () => {
    expect(
      transformTrelloActionsToCardHistories({
        listNameMapping: {},
        trelloActions: [],
      })
    ).to.eql([]);
  });

  it("Trello action is transformed to a card history", () => {
    expect(
      transformTrelloActionsToCardHistories({
        listNameMapping: {
          list1: "List 1",
        },
        trelloActions: [
          {
            type: "createCard",
            date: "2022-12-01",
            data: { list: { id: "list1" }, card: { id: "card1", name: "Card 1" } },
          },
        ],
      })
    ).to.eql([{ cardId: "card1", cardName: "Card 1", date: "2022-12-01", listId: "list1", listName: "List 1" }]);

    expect(
      transformTrelloActionsToCardHistories({
        listNameMapping: {
          list1: "List 1",
          list2: "List 2",
        },
        trelloActions: [
          {
            type: "createCard",
            date: "2022-12-01",
            data: { list: { id: "list1" }, card: { id: "card1", name: "Card 1" } },
          },
          {
            type: "createCard",
            date: "2022-12-02",
            data: { list: { id: "list2" }, card: { id: "card1", name: "Card 1" } },
          },
        ],
      })
    ).to.eql([
      { cardId: "card1", cardName: "Card 1", date: "2022-12-01", listId: "list1", listName: "List 1" },
      { cardId: "card1", cardName: "Card 1", date: "2022-12-02", listId: "list2", listName: "List 2" },
    ]);
  });

  describe("A card leaving the board (deleted, change board or closed / archived) goes to a trash list", () => {
    it("A card deleted goes to the trash list", () => {
      expect(
        transformTrelloActionsToCardHistories({
          listNameMapping: {
            TRASH: "Dropped",
          },
          trelloActions: [
            {
              type: "deleteCard",
              date: "2022-12-02",
              data: { list: { id: "list1" }, card: { id: "card1", name: "Card 1" } },
            },
          ],
        })
      ).to.eql([{ cardId: "card1", cardName: "Card 1", date: "2022-12-02", listId: TRASH_LIST, listName: "Dropped" }]);
    });
    it("A card leaving the board has a step to the trash list", () => {
      expect(
        transformTrelloActionsToCardHistories({
          listNameMapping: {
            TRASH: "Dropped",
          },
          trelloActions: [
            {
              type: "moveCardFromBoard",
              date: "2022-12-02",
              data: { list: { id: "list1" }, card: { id: "card1", name: "Card 1" } },
            },
          ],
        })
      ).to.eql([{ cardId: "card1", cardName: "Card 1", date: "2022-12-02", listId: TRASH_LIST, listName: "Dropped" }]);
    });
    it("An archived card has a step to the trash list", () => {
      expect(
        transformTrelloActionsToCardHistories({
          listNameMapping: {
            TRASH: "Dropped",
          },
          trelloActions: [
            {
              type: "updateCard",
              date: "2022-12-02",
              data: { list: { id: "list1" }, card: { id: "card1", name: "Card 1", closed: true } },
            },
          ],
        })
      ).to.eql([{ cardId: "card1", cardName: "Card 1", date: "2022-12-02", listId: TRASH_LIST, listName: "Dropped" }]);
    });
  });
  it("Action with unknown list is removed'", () => {
    expect(
      transformTrelloActionsToCardHistories({
        listNameMapping: {
          list1: "List 1",
          TRASH: "Dropped",
        },
        trelloActions: [
          {
            type: "updateCard",
            date: "2022-12-02",
            data: { list: { id: "list2" }, card: { id: "card1", name: "Card 1" } },
          },
        ],
      })
    ).to.eql([]);
  });
});
