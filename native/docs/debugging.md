TODO IGAPP-334

# Debugging

For debugging install [react-native-debugger](https://github.com/jhen0409/react-native-debugger) or use the IntelliJ
debugging tool.

## Setup reverse tunnel from device to metro

On Android, you have 2 options:
* Setup a reverse tunnel though adb: `adb reverse tcp:8081 tcp:8081`.
* Open the development options of the react-native app (shake device or Ctrl+M) and set a development host

On iOS the port 8081 is tunneled by default. You cannot change this. If the emulator is running on another host you can proxy the port with `yarn run proxy <host>`.

## Steps to get started with debugging:

* Start react-native-debugger
* Start the metro bundler
* Connect a real device or run an emulator though adb (e.g. `$ANDROID_HOME/emulator/emulator -avd <avd>`)
* Setup network connectivity from the emulator/device to the host where the bundler is running (see [here](#setup-reverse-tunnel-from-device-to-metro))
* [Enter the development menu](#enter-the-development-menu) and enable "Remote JS Debugging"
* The app should reload now, and the debugger should connect to the device

## Enter the development menu

Shake the device or press Ctrl+M to enter the menu. If you are connected through adb to your android device you can also 
run: `adb shell input keyevent 82`

## Reload the app
You can [enter the development menu](#enter-the-development-menu) and click "Reload" or use adb: `adb shell input text "RR"`
