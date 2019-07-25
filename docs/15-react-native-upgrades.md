# Upgrades

## From 0.56.0 to 0.59.9

[Patch file](upgrade-diffs/0.56.0-0.59.9.diff) (Only for a reference. This was not applied directly!)

[Original patch file](https://raw.githubusercontent.com/react-native-community/rn-diff-purge/diffs/diffs/0.56.0..0.59.9.diff)

During this upgrade I tried to get the iOS and Android project to a stable state. This means it should be not quite
similar to an initial react-native project.
The AppleTV project is still not included. It's probably easier to keep it removed from the iOS project.

Upgrades which were skipped without proper upgrading:
* https://github.com/Integreat/integreat-react-native-app/blame/develop/package.json#L43
* https://github.com/Integreat/integreat-react-native-app/blame/7cd9b03f25a0c6425730eb6479ab347a5ab94105/package.json#L36
* https://github.com/Integreat/integreat-react-native-app/blame/69793e1bc794dee89ace2889b89840d476f46603/package.json#L34
* https://github.com/Integreat/integreat-react-native-app/blame/a1a665270772345af0ded47f164aef74c5d1d37e/package.json#L24
* https://github.com/Integreat/integreat-react-native-app/blob/9f89cf9544ec7c9847c3d4b17958bb6aec6db239/package.json#L22

Reason for the upgrade was a [problem with iOS 12.2](https://github.com/react-native-kit/react-native-track-player/issues/513).