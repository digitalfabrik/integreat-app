import { Platform, TouchableHighlight, TouchableNativeFeedback, TouchableWithoutFeedbackProps } from 'react-native'
import React from 'react'

export default Platform.select<React.ComponentType<TouchableWithoutFeedbackProps>>({
  android: TouchableNativeFeedback,
  ios: TouchableHighlight,
  default: TouchableHighlight
})
