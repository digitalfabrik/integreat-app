# Windows setup

Since we noticed some issues with the usage of windows which can be happened, here a small setup guide

## Empty setup

If react native is already running on your machine you can skip this part.

This guide will help you setup a fresh development environment if you have no development tools on your machine.
I recommend [Chocolatey](https://chocolatey.org/) as package manager for the tool installation, but is not required. 
This is usually a one-click solution and very easy to use. If you don't use choco you need to install the listed tools manually.

To install Chocolatey open PowerShell as **admin** and run:
 
 ````shell script
  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
 ````

You will need the following tools:
 ````shell script
  choco install nodejs-lts -y
  choco install yarn -y
  choco install openjdk
  choco install ruby -y
  
  # if you have a ultimate licence for intellij
  choco install intellijidea-ultimate -y
  # if you don't have the ultimate licence as student
  choco install intellijidea-community -y

  # for the initial setup is android studio a good choice (sdk installation, build tools and emulator)
  choco install androidstudio -y
````
 Optional you can install [GitExtensions](https://gitextensions.github.io/) as local git client
 ````shell script
  choco install gitextensions -y
````

After the installation is reboot required.

## Windows Defender Settings

Have a look to our [trouble shooting guide](02-troubleshooting.md) as well to fix some common windows issues.
