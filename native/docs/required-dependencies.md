# Required Dependencies

There are several dependencies which seem to be unused but are actually required by other libraries and MUST not be removed.
These are:

- `@react-native-community/progress-bar-android`: Required by [react-native-pdf](https://github.com/wonday/react-native-pdf/issues/469#issuecomment-649426140)
- `@react-native-community/progress-view`: Required by [react-native-pdf](https://github.com/wonday/react-native-pdf/issues/469#issuecomment-649426140)
- `react-native-blob-util`: Required by [react-native-pdf](https://github.com/wonday/react-native-pdf#supported-versions)
- `events`: Required by [htmlparser2](https://github.com/fb55/htmlparser2)
