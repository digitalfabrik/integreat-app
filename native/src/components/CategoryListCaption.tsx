import * as React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components/native'
import { ThemeType } from 'build-configs'

const H1 = styled.Text<{
  withThumbnail: boolean
}>`
  padding: ${props => (props.withThumbnail ? '0 0' : '20px 0')};
  font-size: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`
type PropsType = {
  title: string
  theme: ThemeType
  withThumbnail: boolean
}

class CategoryListCaption extends React.Component<PropsType> {
  render(): ReactNode {
    return (
      <H1 withThumbnail={this.props.withThumbnail} theme={this.props.theme}>
        {this.props.title}
      </H1>
    )
  }
}

export default CategoryListCaption
