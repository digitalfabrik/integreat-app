// @flow

import React from 'react'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'

const H1: StyledComponent<{ withThumbnail: boolean }, ThemeType, *> = styled.Text`
  padding : {props => this.props.withThumbnail ? '0 0' : '20px 0'};
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
    return <H1 withThumbnail={this.props.withThumbnail} theme={this.props.theme}>{this.props.title}</H1>
  }
}

export default CategoryListCaption
