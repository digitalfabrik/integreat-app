// @flow

import React from 'react'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'

const H1: StyledComponent<{}, ThemeType, *> = styled.Text`
  padding: 20px 0;
  font-size: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontBold};
`

type PropsType = {|
  title: string,
  theme: ThemeType
|}

class Caption extends React.Component<PropsType> {
  render () {
    return <H1 theme={this.props.theme}>{this.props.title}</H1>
  }
}

export default Caption
