// @flow

import React from 'react'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'

const H1: StyledComponent<{}, ThemeType, *> = styled.Text`
  padding: 20px 0;
  font-size: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontBold};
`

const H2: StyledComponent<{}, ThemeType, *> = styled.Text`
  padding: 0 0;
  font-size: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontBold};
`
type PropsType = {|
  title: string,
  theme: ThemeType,
  withThumbnail: boolean
|}

class CategoryListCaption extends React.Component<PropsType> {
  render () {
    if (this.props.withThumbnail) {
      return <H2 theme={this.props.theme}>{this.props.title}</H2>
    } else {
      return <H1 theme={this.props.theme}>{this.props.title}</H1>
    }
  }
}

export default CategoryListCaption
