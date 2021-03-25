# Debugging

For debugging [flipper](https://fbflipper.com/) is recommended.
It allows debugging of logs, network requests, views and redux actions.

## Setup

- Download and install [flipper](https://fbflipper.com/)
- Run flipper
- Install and run the app which should be debugged
- \[optional\]: Install `redux-debugger` plugin in flipper:
  `Manage plugins > Install plugins > redux-debugger > Install`
- \[optional\]: Enable plugins for installation

### iOS

On iOS the [iOS Development Bridge (idb)](https://github.com/facebook/idb#quick-start) has to be installed additionally:

- `brew tap facebook/fb`
- `brew install idb-companion`
- `pip3 install fb-idb`
