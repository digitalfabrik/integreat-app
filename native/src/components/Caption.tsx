import React, { ReactNode } from 'react'
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

class Caption extends React.Component<PropsType> {
  render(): ReactNode {
    return <H1 theme={this.props.theme}>{this.props.title}</H1>
  }
}

export default Caption
