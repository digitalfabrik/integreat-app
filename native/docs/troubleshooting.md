# Troubleshooting

## Contents

* [Problems with sharp or other node modules](#problems-with-sharp-or-other-node-modules)
* [Incompatible Gradle Version](#incompatible-gradle-version)
* [java.io.IOException: Unable to delete the directory on Windows 10](#javaioioexception-unable-to-delete-the-directory-on-windows-10)
* [`ERROR watch... ENOSPC` when running `yarn start` on Linux](#error-watch-enospc-when-running-yarn-start-on-linux)
* [adb not found](#adb-not-found)
* ['adb server version (x) doesn't match this client (y)'](#adb-server-version-x-doesnt-match-this-client-y)
* [adb shows no-permission](#adb-shows-no-permission)
* [Build failed with an exception](#build-failed-with-an-exception)
* [App hangs on loading screen](#app-hangs-on-loading-screen)
* [`bundle exec fastlane certificates` hangs on `Cloning remote git repo...`](#bundle-exec-fastlane-certificates-hangs-on-cloning-remote-git-repo)
* [`Failed to get language code from native side!` in the simulator](#failed-to-get-language-code-from-native-side-in-the-simulator)
* [Gradle `resource string/BUILD_CONFIG_APP_NAME not found`](#gradle-resource-stringbuild_config_app_name-not-found)
* [`No BUILD_CONFIG_NAME supplied`](#no-build_config_name-supplied)
* [`Invalid BUILD_CONFIG_NAME supplied`](#invalid-build_config_name-supplied)
* [App crashing with java.lang.UnsatisfiedLinkError](#app-crashing-with-javalangunsatisfiedlinkerror)

## Problems with sharp or other node modules

Use nodejs 12 LTS instead of the latest version.

## Incompatible Gradle Version

The current gradle version may not work with Java 14. Switch to a lower java version (e.g. v11) or try to fix the issue.

## java.io.IOException: Unable to delete the directory on Windows 10

Possible solutions:
* Switch to Linux :)
* Windows Security > Virus & threat protection settings > 
  * Controlled folder access > Manage Controlled folder access > Set to `Off`
  * Exclusions > Add or Remove exclusions > 
    * Add the workspace folder
    * Maybe also add user specific configuration locations and appdata folder if required
* Run the IDE as administrator
* For first time android developer open IntelliJ with the Android Support plugin installed, create an Android project and start the app.
    
## `ERROR watch... ENOSPC` when running `yarn start` on Linux

Increase the number of inotify watches by running  
`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

## adb not found

There are 2 ways to fix this:

1. Link `/usr/bin/adb` to the adb client you installed (usually the one at `~/Android/sdk/platform-tools/adb`)
2. Add `~/Android/sdk/platform-tools/adb` to your $PATH

## 'adb server version (x) doesn't match this client (y)'

Make sure you only have one version of adb installed. Probably your system has adb installed and another version is available in the Android SDK. There are 2 ways to fix this:

1. Link `/usr/bin/adb` to the adb client you installed (usually the one at `~/Android/sdk/platform-tools/adb`)
2. Add `~/Android/sdk/platform-tools/adb` to your $PATH

## adb shows no-permission

[Setup udev rules](https://wiki.archlinux.org/index.php/Android_Debug_Bridge#Adding_udev_Rules) to allow user accounts to access your phone.

## Build failed with an exception

* What went wrong: 

Execution failed for task ':app:installDebug':
`> com.android.builder.testing.api.DeviceException: com.android.ddmlib.InstallException: INSTALL_FAILED_VERSION_DOWNGRADE`

* Fix

Uninstall already existing application from target device

## App hangs on loading screen

* What went wrong:

The app starts, but remains in the loading screen for long time

* Fix

Close the app on the device complete and re-open it on the device 

## `bundle exec fastlane certificates` hangs on `Cloning remote git repo...`

Copy the last command printed to the console (`git clone ...`) and execute it manually for more information, errors or password prompts.
    * Make sure to have read and write access to the app-credentials repo.
    * Make sure to have git properly set up on the machine (using **ssh** protocol instead of https).
    * The ssh key has to be added permanently in order for the command to work: `cd ~/.ssh/; ssh-add`.
    
## `Failed to get language code from native side!` in the simulator

* Go to `(Device) Settings` > `General` > `Language and Region`.
* Change `iPhone Language` and `Region`.
* Reload the app.

## Gradle `resource string/BUILD_CONFIG_APP_NAME not found`

Environment variable `BUILD_CONFIG_NAME` not set before building the app via gradle.
More information on how to set the environment variable can be found [here](build-configs.md#gradle-android-build).

## No BUILD_CONFIG_NAME supplied

Environment variable `BUILD_CONFIG_NAME` not set before running the packager.
More information on how to set the environment variable can be found [here](build-configs.md#runtime-javascript).

## Invalid BUILD_CONFIG_NAME supplied

Invalid environment variable `BUILD_CONFIG_NAME` set before running the packager.
All available build configs can be found [here](../../docs/build-configs.md#available-build-configs).

## App crashing with java.lang.UnsatisfiedLinkError 

The following error occurs:
`java.lang.UnsatisfiedLinkError: couldn't find DSO to load: libflipper.so caused by: dlopen failed: library "libevent_extra-2.1.so" not found result: 0`

* Delete the folder `android/app/build` 
* Delete the app
* Reinstall the app (`yarn android`)
