# Troubleshooting

## Invalid VCS Root
Initialize and update the locales submodule as stated in the [README](../README.md/#project-setup).

## Problems with sharp or other node modules
Use nodejs 12 LTS instead of the latest version.

## java.io.IOException: Unable to delete the directory on Windows 10
Possible solutions:
* Switch to Linux :)
* Windows Security > Virus & threat protection settings > 
  * Controlled folder access > Manage Controlled folder access > Set to `Off`
  * Exclusions > Add or Remove exclusions > 
    * Add the workspace folder
    * Maybe also add user specific configuration locations and appdata folder if required
* Run the IDE as administrator
* For first time android developer try to open Android Studio and create and start one of the samples 
  (there are a lot of hints present)
    
## `ERROR watch... ENOSPC` when running `yarn start` on Linux
Increase the number of inotify watches by running  
`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

## adb not found
There are 2 ways to fix this:

1. Link `/usr/bin/adb` to the adb client you installed (usually the one at `~/Android/sdk/platform-tools/adb`)
2. Add `~/Android/sdk/platform-tools/adb` to your $PATH

## 'adb server version (x) doesn't match this client (y)'
Make sure you only have one version of adb installed. Probably your system has one and Android Studio installed a second
one. There are 2 ways to fix this:

1. Link `/usr/bin/adb` to the adb client you installed (usually the one at `~/Android/sdk/platform-tools/adb`)
2. Add `~/Android/sdk/platform-tools/adb` to your $PATH

## adb shows no-permission
[Setup udev rules](https://wiki.archlinux.org/index.php/Android_Debug_Bridge#Adding_udev_Rules) to allow user accounts to access your phone.
