import React from 'react'
import { Platform, TouchableHighlight, TouchableHighlightProps, TouchableNativeFeedback } from 'react-native'

export default Platform.select<React.ComponentType<TouchableHighlightProps>>({
  android: TouchableNativeFeedback,
  ios: TouchableHighlight,
  default: TouchableHighlight,
})
