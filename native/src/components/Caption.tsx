import React, { ReactElement } from 'react'
import { StyleProp, TextStyle } from 'react-native'

import Text from './base/Text'

type CaptionProps = {
  title: string
  language?: string
  style?: StyleProp<TextStyle>
}

const Caption = ({ title, language, style }: CaptionProps): ReactElement => (
  <Text
    variant='h4'
    style={[{ paddingVertical: 20, textAlign: 'center' }, style]}
    android_hyphenationFrequency='full'
    accessibilityLanguage={language}>
    {title}
  </Text>
)

export default Caption
