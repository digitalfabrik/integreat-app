# Visual Studio Code Installation

- [Installation](#installation)
- [Settings](#settings)
  - [Optional settings](#optional-settings)
- [Required Extensions](#required-extensions)
  - [Eslint Code Formatter](#eslint-code-formatter)
- [Recommended Extensions](#recommended-extensions)
  - [Git Lens](#git-lens)
  - [Intellisense for imports](#intellisense-for-imports)
  - [File Change history](#file-change-history)
  - [Jest support](#jest-support)
  - [.md-Files](#md-files)

## Installation

Download and Install [Visual Studio Code](https://code.visualstudio.com/) or use [Chocolatey](https://chocolatey.org/):

https://code.visualstudio.com/Download  
https://code.visualstudio.com/docs/setup/linux  
or

```
choco install vscode
```

## Settings

There are global user settings and local workspace settings. You can search for the settings key in the settings page or edit the files directly.

Open Settings:
`File > Preferences > Settings (Ctrl+,)`

Local workspace:
[../web/.vscode/settings.json](../web/.vscode/settings.json)
Global settings (Windows):
[%appdata%/Code/User/settings.json](%appdata%/Code/User/settings.json)

Adjust the following settings corresponding to your preferences:

```
File > Preferences > Keyboard Shortcuts
# or install a known ones (e.g. IntelliJ)
File > Preferences > Keymaps
```

### Optional settings

```
// Do not close file when opening another one
"workbench.editor.enablePreviewFromQuickOpen": false,
"workbench.editor.enablePreview": false,

// Do not show mini code preview on the right side
"editor.minimap.enabled": false,

// Do not automatically commmit unstaged files
"git.enableSmartCommit": false,

// Privacy
"telemetry.enableCrashReporter": false,
"telemetry.enableTelemetry": false,
"update.enableWindowsBackgroundUpdates": false
```

## Required Extensions

The following extensions (or any alternatives) should be installed.

### Eslint Code Formatter

For formatting we use eslint and prettier:

https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint  
https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode  
https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint

```
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extenstion rvest.vs-code-prettier-eslint
```

Activate vs-code-prettier as default formatter. VSCode should ask you when you format (Right mouse menu in code or Alt-Shift-F). Otherwise add it manually to the [global user settings](%appdata%/Code/User/settings.json)
file:

```
"[typescript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[typescriptreact]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

Until now Integreat uses an external repo for the eslint configuration. After Checking out the repo allow eslint to use the npm module in node_modules/eslint.

## Recommended Extensions

When opening the extension menu in VSCode the recommended extensions are marked with a star. They are defined in [../extensions.json]() and [../web/extensions.json]()

### Git Lens

https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens

```
code --install-extension eamodio.gitlens
```

Remark: This extension adds a lot of context menus, configure it to your needs

### Intellisense for imports

https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense

```
code --install-extension christian-kohler.npm-intellisense
code --install-extension christian-kohler.path-intellisense
```

### File Change history

https://marketplace.visualstudio.com/items?itemName=xyz.local-history

```
code --install-extension xyz.local-history
```

Set path in settings:

```
"local-history.path": "<Path outside of project to not use .gitignore>",
```

### Jest support

https://marketplace.visualstudio.com/items?itemName=gamunu.vscode-yarn

```
code --install-extenstion Orta.vscode-jest
```

### .md-Files

Adds a button in the top right corner to see markdown files formatted
https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one

```
code --install-extension yzhang.markdown-all-in-one
```

... and many more like e.g. yarn support and jira support  
Try out and enjoy! :)
