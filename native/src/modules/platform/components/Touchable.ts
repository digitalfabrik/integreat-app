import { TouchableNativeFeedback, TouchableHighlight, Platform } from 'react-native'
export default Platform.select({
  // @ts-ignore
  android: TouchableNativeFeedback,
  ios: TouchableHighlight
})
