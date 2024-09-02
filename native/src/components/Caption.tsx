import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components/native'

import { AppContext } from '../contexts/AppContextProvider'
import Text from './base/Text'

const H1 = styled(Text)`
  padding: 20px 0;
  font-size: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`
type CaptionProps = {
  title: string
}

const Caption = ({ title }: CaptionProps): ReactElement => {
  const { languageCode } = useContext(AppContext)
  return (
    <H1 android_hyphenationFrequency='full' accessibilityLanguage={languageCode}>
      {title}
    </H1>
  )
}

export default Caption
