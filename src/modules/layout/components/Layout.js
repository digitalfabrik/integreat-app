// @flow

import * as React from 'react'
import { StatusBar } from 'react-native'
import styled from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'

type WrapperPropsType = {
  statusBarHeight: number,
  theme: ThemeType
}

const Wrapper = styled.View`
  flex: 1;
  margin-top: ${(props: WrapperPropsType) => props.statusBarHeight};
  background-color: ${(props: WrapperPropsType) => props.theme.colors.backgroundColor};
`

type AppPropsType = {
  statusBarHeight: number,
  children?: React.Node,
  theme: ThemeType
}

class Layout extends React.Component<AppPropsType> {
  render () {
    return (
      <Wrapper theme={this.props.theme} statusBarHeight={this.props.statusBarHeight}>
        <StatusBar backgroundColor='#fbda16' barStyle='dark-content' />

        {this.props.children}
      </Wrapper>
    )
  }
}

export default Layout
