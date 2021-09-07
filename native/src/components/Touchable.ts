import React from 'react'
import { Platform, TouchableHighlight, TouchableNativeFeedback, TouchableWithoutFeedbackProps } from 'react-native'

export default Platform.select<React.ComponentType<TouchableWithoutFeedbackProps>>({
  android: TouchableNativeFeedback,
  ios: TouchableHighlight,
  default: TouchableHighlight
})
