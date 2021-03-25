# Windows Setup

## Setup of Development Tools

If react native is already running on your machine you can skip this part.

This guide will help you setup a fresh development environment if you have no development tools on your machine.
We recommend [Chocolatey](https://chocolatey.org/) as package manager for the tool installation, but is not required.
This is usually a one-click solution and very easy to use. If you don't use choco you need to install the listed tools manually.

First install Chocolatey as documented [here](https://chocolatey.org/install).

You will need the following tools:

```shell script
 choco install nodejs-lts
 choco install yarn
 choco install openjdk
```

As IDE [IntelliJ](https://www.jetbrains.com/de-de/idea/) is recommended because it is used by most members of the team:

```
  # if you have a ultimate licence for intellij
  choco install intellijidea-ultimate
  # if you don't have the ultimate licence
  choco install intellijidea-community
```

Alternatively install [Visual Studio Code](https://code.visualstudio.com/): [./vscode.md](./vscode.md)

or [Android Studio](https://developer.android.com/studio) (not tested):

```
choco install androidstudio
```

Reboot after the installation.

## Android Emulator

To use an Android Emulator instead or beside of your mobile to develop the native app you can use [Android Studio](https://developer.android.com/studio/run/emulator) (recommended by Google) or install only the emulator via PowerShell: [./native/android-emulator-windows.md](./native/android-emulator-windows.md)

## Troubleshooting

Have a look at our [trouble shooting guide](docs/troubleshooting.md) as well for information on how to fix some common windows issues.
