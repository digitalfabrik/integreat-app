# Android Emulator without Android SDK in Windows

- [Install Java](#install-java)
- [Install HAXM](#install-haxm)
- [Download cmdline-tools](#download-cmdline-tools)
- [TL;DR - Quickinstall](#tldr---quickinstall)
- [Download android platform tools](#download-android-platform-tools)
- [Download Image and Emulator](#download-image-and-emulator)
- [Final Folder Structure](#final-folder-structure)
- [Set Paths](#set-paths)
- [Create the Android Virtual Device (avd)](#create-the-android-virtual-device-avd)
- [Start the emulator](#start-the-emulator)
- [Using the emulator with WSL2 (untested)](#using-the-emulator-with-wsl2-untested)

## Install [Java](https://www.java.com/de/)


```
choco install jdk8
```
(This should also set the corresponding paths, e.g. ````JAVA_HOME C:\Program Files\Java\jdk1.8.0_211```` and ````PATH C:\Program Files\Java\jdk1.8.0_211\bin````)

*Installation was only tested with this Java version, different versions may not work*

## Install HAXM

Install HAXM hardware accelerator for the emulator (recommended for powerful PCs)  
https://github.com/intel/haxm/releases

## Download cmdline-tools

This installs the sdkmanager and the avdmanager.
We need the  sdkmanager for downloading the emulator, more info about the tool:  
https://developer.android.com/studio/command-line/sdkmanager

Download Android Command Line Tools from 
https://developer.android.com/studio/#cmdline-tools

Create a new folder for the Sdk (ANDROID_SDK_ROOT), e.g. ```C:\Android\Sdk```

Extract the cmdline-tools and move the content to  
```C:\Android\Sdk\cmdline-tools\tools\```  
so it contains ```\bin``` and ```\lib```  
(This is folder structure important but undocumented, more info [here](https://stackoverflow.com/questions/60440509/android-command-line-tools-sdkmanager-always-shows-warning-could-not-create-se))

Open a PowerShell Window and go to 
```
cd C:\Android\Sdk\cmdline-tools\tools\bin
```
to use the sdkmanager and the avdmanager for the next steps 

## TL;DR - Quickinstall

Set Paths: [Set Paths](#set-paths)

Run
```
sdkmanager --install "system-images;android-29;default;x86" "platform-tools" "platforms;android-29"
echo no | avdmanager create avd --name "android-29_default_x86" --package "system-images;android-29;default;x86"
```
Start "yarn android" in integreat-app/native folder

Enjoy.

## Download android platform tools

Download the platform tools including adb and fastboot:
```
./sdkmanager.bat "platform-tools"
```
This creates a new folder in ANDROID_SDK_ROOT:  
```C:\Android\Sdk\platform-tools```

## Download Image and Emulator

List the Android System Images available:  
```
./sdkmanager.bat --list | findstr system-images
```

Download the most recent Image and the corresponding platform tools (here android-29).  
It also automatically downloads the Emulator.  
Do not download an image with "google_api" instead of "default", these contain the Google PlayStore and need a verification    
```
./sdkmanager.bat --install "system-images;android-29;default;x86"
```
as well as the corresponding platform 
```
sdkmanager "platforms;android-29"
```

This downloads the image and the emulator and creates following folder structure in ANDROID_SDK_ROOT:

## Final Folder Structure

Your folder inside your ANDROID_SDK_ROOT (here "C:\Android\Sdk") should now look like this

- **cmdline-tools** *(sdkmanager and avdmanager)*
- **emulator**
- licenses
- patcher
- **platforms**
- **platform-tools**
- **system-images**

You now also have a new subfolder in your user folder named ".android"

## Set Paths

To use the emulator you need to add the following paths to windows. You should also add the path of sdkmanager and avdmanager to use it from everywhere without changing into the directory.
  
Go to "environment variables" (search for env in windows search bar)
In the "System Variables" Section:

Add the path to the sdk root as new variable:  
```
ANDROID_SDK_ROOT C:\Android\Sdk
```

Add the path to the sdkmanager and the emulator to the existing ````PATH```` variable:  
```
C:\Android\Sdk\cmdline-tools\tools\bin
C:\Android\Sdk\emulator
C:\Android\Sdk\platform-tools
```

Close and reopen your powershell to have the new paths set.

## Create the Android Virtual Device (avd)

We need the avdmanager for creating the Virtual Device from the image we downloaded with the sdkmanager.  
More info about the tool: https://developer.android.com/studio/command-line/avdmanager

Use your downloaded image to create the virtual device (here: "````system-images;android-29;default;x86````").  

````
avdmanager --verbose create avd --name "android-29_default_x86" --package "system-images;android-29;default;x86"
````
We do not need a special hardware profile, so answer "Do you wish to create a custom hardware profile?" with "no"

This creates a new subfolder in your user folder with the given name:  
```<userfolder>\.android\avd\android-29_default_x86```

The settings of the Device can be changed settings are in
<userfolder>\.android\avd\android-29_default_x86.avd/config.ini.  
To use the keyboard of your PC set
```
hw.keyboard=yes
```

## Start the emulator

Start the Virtual Device with
````
emulator -avd android-29_default_x86
````
Using "yarn android" in the integreat-app native folder will find and start the emulator automatically

## Using the emulator with WSL2 (untested)

https://medium.com/@pellea/using-the-android-emulator-on-windows-10-with-wsl2-39c2bae30c49