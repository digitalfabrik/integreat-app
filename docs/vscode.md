# Visual Studio Code Installation

- [Installation](#installation)
- [Settings](#settings)
  - [Optional settings](#optional-settings)
- [Required Extensions](#required-extensions)
  - [Flow Type Checker](#flow-type-checker)
  - [Eslint Code Formatter](#eslint-code-formatter)
- [Recommended Extensions](#recommended-extensions)
  - [Git History](#git-history)
  - [... Save your ass](#-save-your-ass)
  - [Remote WSL](#remote-wsl)
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

Adjust the following settings corresponding to your preferences: 
```
File > Preferences > Keyboard Shortcuts
# or install a known ones (e.g. IntelliJ)
File > Preferences > Keymaps
```

### Optional settings

```
File > Preferences > Settings (Ctrl+,)
```
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

### Flow Type Checker
(Alternative: Flow Language Support)

Hint: Use "yarn flow check" instead of "yarn flow" in the console, currently there is a [Bug](https://github.com/facebook/flow/issues/6592) in Windows
```
code --install-extension gcazaciuc.vscode-flow-ide
```
Important: Deactivate internal standard javascript validator in settings:
```
"javascript.validate.enable": false,    
```

### Eslint Code Formatter

```
code --install-extension dbaeumer.vscode-eslint
code --install-extension rvest.vs-code-prettier-eslint
```
Activate vs-code-prettier as default formatter. VSCode should ask you, otherwise set it manually:
```
"[javascript]": {
    "editor.defaultFormatter": "rvest.vs-code-prettier-eslint"
}
```
Until now Integreat uses an external repo for the eslint configuration. After Checking out the repo allow eslint to use the npm module in node_modules/eslint.  
The eslint extension button is in the bottom right corner of the IDE

## Recommended Extensions

### Git History
(Alternative: Git Lens)

```
code --install-extension donjayamanne.githistory      
```

### ... Save your ass
(Changes History)

```
code --install-extension xyz.local-history
```
Set path in settings:
```
"local-history.path": "<Path outside of project to not use .gitignore>",
```

### Remote WSL

Use Visual Studio Code in Windows as GUI for code running in WSL  
https://code.visualstudio.com/docs/remote/wsl
```
code --install-extension ms-vscode-remote.remote-wsl
```

### .md-Files 

use button in top right corner see the formatted markup
```
code --install-extension yzhang.markdown-all-in-one   
```