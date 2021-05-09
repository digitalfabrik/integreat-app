import { TouchableNativeFeedback, TouchableHighlight, Platform } from 'react-native'
export default Platform.select({
  android: TouchableNativeFeedback,
  ios: TouchableHighlight
})
