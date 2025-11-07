import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import Text from './base/Text'

const H1 = styled(Text)`
  padding: 20px 0;
  font-size: 20px;
  text-align: center;
  color: ${props => props.theme.legacy.colors.textColor};
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontBold};
`
type CaptionProps = {
  title: string
  language?: string
}

const Caption = ({ title, language }: CaptionProps): ReactElement => (
  <H1 android_hyphenationFrequency='full' accessibilityLanguage={language}>
    {title}
  </H1>
)

export default Caption
