# Prerequisites

- Google Chrome
- Git
- NodeJS
- Docker
- VS Code

# How to install

## Clone project

1. Open VS Code
2. "Show All Commands" `Ctrl+Alt+P`
3. "Git: Clone"
4. Enter Repository URL: "https://gitlab.com/me.jahro/pe.git"
5. Enter credentials
6. "Would you like to open the cloned repository?" -> `Open`
7. Open file [pe.code-workspace](https://gitlab.com/me.jahro/pe/blob/master/pe.code-workspace) and click `Open workspace`
8. "This workspace has extension recommendations" -> `Install All`

## Project setup

- MICROSERVICE => [package.json](https://gitlab.com/me.jahro/pe/blob/master/package.json) => [start-debug](https://gitlab.com/me.jahro/pe/blob/master/package.json#L18)
- or from terminal (` Ctrl+`` `)

```
npm run start-debug
```

## Debug

- `Ctrl+Shift+D` opens Debug view
- Run "Debug the whole app"
- Set breakpoints and watch how VS Code (with [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)) can debug frontend and backend apps at the same time

## Explore database

- From [Azure Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) `Attach Database Account` (right-click "Attached Database Accounts")
- For MongoDB enter URL to running mongodb container e.g. "mongodb://127.0.0.1:27017"
