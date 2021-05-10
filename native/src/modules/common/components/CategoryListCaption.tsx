import * as React from 'react'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import 'styled-components'
import type { ThemeType } from '../../theme/constants'
const H1: StyledComponent<
  {
    withThumbnail: boolean
  },
  ThemeType,
  any
> = styled.Text`
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
  render() {
    return (
      <H1 withThumbnail={this.props.withThumbnail} theme={this.props.theme}>
        {this.props.title}
      </H1>
    )
  }
}

export default CategoryListCaption
