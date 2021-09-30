import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

const H1 = styled.Text`
  padding: 20px 0;
  font-size: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`
type PropsType = {
  title: string
  theme: ThemeType
}

const Caption = ({ title, theme }: PropsType): ReactElement => <H1 theme={theme}>{title}</H1>

export default Caption
