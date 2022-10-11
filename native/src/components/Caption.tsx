import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import Text from './base/Text'

const H1 = styled(Text)`
  padding: 20px 0;
  font-size: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`
type CaptionPropsType = {
  title: string
}

const Caption = ({ title }: CaptionPropsType): ReactElement => <H1>{title}</H1>

export default Caption
