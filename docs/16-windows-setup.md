# Windows Setup

Since we noticed some issues with the usage of windows which can be happened, here a small setup guide

## Setup of Development Tools

If react native is already running on your machine you can skip this part.

This guide will help you setup a fresh development environment if you have no development tools on your machine.
We recommend [Chocolatey](https://chocolatey.org/) as package manager for the tool installation, but is not required. 
This is usually a one-click solution and very easy to use. If you don't use choco you need to install the listed tools manually.

First install Chocolatey as documented [here](https://chocolatey.org/install).

You will need the following tools:
 ````shell script
  choco install nodejs-lts
  choco install yarn
  choco install openjdk

  # if you have a ultimate licence for intellij
  choco install intellijidea-ultimate
  # if you don't have the ultimate licence
  choco install intellijidea-community

  # for the initial setup is android studio a good choice (sdk installation, build tools and emulator)
  choco install androidstudio
````

Reboot after the installation.

## Windows Defender Settings

Have a look to our [trouble shooting guide](02-troubleshooting.md) as well to fix some common windows issues.
