# If you encounter problems:
    
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
