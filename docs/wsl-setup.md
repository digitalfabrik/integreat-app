# Setup WSL for integreat-app

Most of the webapp has been developed from a Linux environment.
To avoid environment specific troubleshooting and to improve performance
it is recommended to set up and use the `Windows Subsystem for Linux (WSL)` on Windows.

## Setup

1. Install wsl ([Official Guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10))
   - Open `Windows PowerShell` and run:

   ```powershell
   wsl --install
   ```

   - Restart Windows

2. Setup Ubuntu user
   - Open newly installed app `Ubuntu`
   - Set a username and password
3. Update packages and install `nodejs` and `npm`
   ```bash
   sudo apt update && sudo apt install nodejs npm yarn
   ```
4. Update `nodejs` to v22: https://joshtronic.com/2024/05/26/ubuntu-nodejs-22-install/
5. Install `yarn`
   ```bash
   npm install --global yarn
   ```
   [Optional] If you run into permission problems, run the following commands to change the npm installation directory:
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   export PATH=~/.npm-global/bin:$PATH
   source ~/.profile
   ```
6. [Optional] Setup IntelliJ
   - In IntelliJ navigate to File > Settings > Languages & Frameworks > Node.js and NPM
   - In the Dropdown for the node interpreter select `Add... > Add WSL...` and then your node installation should be listed
   - If the package manager (yarn) is not detected automatically set the path manually (usr/share/yarn)
   - Confirm with OK.
   - Now the project will run in the Linux Subsystem.
   - **Note**: If you open a different project the default project interpreter will be your Windows node installation. In that case you can just navigate to File > Settings > Languages & Frameworks > Node.js and NPM and select the Subsystems node installation
   - Navigate to File > Settings > Tools > Terminal and replace the shell path with `C:\Windows\system32\bash.exe`
7. [Optional] Setup VS Code: https://code.visualstudio.com/docs/remote/wsl
