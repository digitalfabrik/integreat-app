import * as React from 'react'
import styled from 'styled-components/native'
import { ThemeType } from 'build-configs/dist/ThemeType'

const GroupText = styled.Text`
  margin-top: 5px;
  padding: 10px 0;
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  color: ${props => props.theme.colors.textColor};
`
// Wrapper is necessary, because iOS doesn't display border for Text components.
const BorderWrapper = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
`

type PropsType = {
  theme: ThemeType
  children: string
}

class CityGroup extends React.Component<PropsType> {
  render() {
    return (
      <BorderWrapper theme={this.props.theme}>
        <GroupText theme={this.props.theme}>{this.props.children}</GroupText>
      </BorderWrapper>
    )
  }
}

export default CityGroup
