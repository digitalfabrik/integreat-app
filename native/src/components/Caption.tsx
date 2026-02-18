import React, { ReactElement } from 'react'

import Text from './base/Text'

type CaptionProps = {
  title: string
  language?: string
}

const Caption = ({ title, language }: CaptionProps): ReactElement => (
  <Text
    variant='h4'
    style={{ paddingVertical: 20, textAlign: 'center' }}
    android_hyphenationFrequency='full'
    accessibilityLanguage={language}>
    {title}
  </Text>
)

export default Caption
