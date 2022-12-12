# Kanban Metrics

Export a CSV of card history from Trello.

In which list was the card on such date.

## CSV Fields

- cardId
- cardName
- listId
- listName (configurable)
- Date

## Configuration

Set the environment variables :

- `TRELLO_KEY`
- `TRELLO_TOKEN`
- `TRELLO_BOARD_ID`
- `LIST_NAMES` with value :
```
  '{
    "[LIST_ID]": "[LIST NAME YOU WANT TO USE]",
    ...
    "TRASH": "[LIST NAME YOU WANT TO USE FOR DROPPED CARDS]"
  }'
```

Only lists in LIST_NAMES are exported.

## Run

`$ npm ci`

`$ npm run exportCardHistoriesToCsv [PATH_TO_CSV_EXPORT]`