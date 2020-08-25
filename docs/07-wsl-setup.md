# How to run the webapp on linux subsystem on Windows (WSL1)?
Most of the webapp has been developed from a Linux environment.
To avoid environment specific troubleshooting and to improve performance it is recommended to set up and use the Windows Subsystem for Linux (WSL) on Windows.

## Setup

1. Enable the linux subsystem ([Official Guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10))
    - In the powershell run:
    ```powershell
    dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
    ```
    - Restart Windows
    - Install a Linux distribution of your choice (see Microsoft Store)
    - (The following section relates to how to setup the bash on Ubuntu)
2. In the cmd run bash to Initially setup your bash profile. 
    - in the bash run
    ```bash
    sudo apt update
    ```
    - in the bash [install node](https://github.com/nodesource/distributions/blob/master/README.md):
    ```bash
    sudo apt-get nodejs
    ```
    - in the bash install npm (as nodejs does not contain npm)
    ```bash
    sudo apt-get install npm
    ```
    - in the bash [install yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable)
    ```bash
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt update && sudo apt install yarn
    ```
    
    Note: On Ubuntu you might encounter some issues regarding the package cmdtest and curl. For that remove cmdtest (`sudo apt remove cmdtest`) and if you have any problems with curl run
    ```bash
    sudo apt remove gpg
    sudo apt-get update -y
    sudo apt-get install -y gnupg1
    ```

3. Setup IntelliJ
    - In IntelliJ navigate to File > Settings > Languages & Frameworks > Node.js and NPM
    - In the Dropdown for the node interpreter select `Add... > Add WSL...` and then your node installation should be listed
    - If the package manager (yarn) is not detected automatically set the path manually (usr/share/yarn)
    - Confirm with OK.
    - Now the project will run in the Linux Subsystem.
    - **Note**: If you open a different project the default project interpreter will be your Windows node installation. In that case you can just navigate to File > Settings > Languages & Frameworks > Node.js and NPM and select the Subsystems node installation

4. Optional: Setup the bash in IntelliJ
- In IntelliJ navigate to File > Settings > Tools > Terminal and replace the shell path with `C:\Windows\system32\bash.exe` or `C:\Windows\system32\wsl.exe`
