import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

const H1 = styled.Text`
  padding: 20px 0;
  font-size: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`
type PropsType = {
  title: string
}

const Caption = ({ title }: PropsType): ReactElement => <H1>{title}</H1>

export default Caption
