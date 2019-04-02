// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'

type WrapperPropsType = {
  theme: ThemeType
}

const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props: WrapperPropsType) => props.theme.colors.backgroundColor};
`

type AppPropsType = {
  children?: React.Node,
  theme: ThemeType
}

class Layout extends React.Component<AppPropsType> {
  render () {
    return (
      <Wrapper theme={this.props.theme}>
        {this.props.children}
      </Wrapper>
    )
  }
}

export default Layout
