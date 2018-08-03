// @flow

import * as React from 'react'
import { StatusBar } from 'react-native'
import styled from 'styled-components'
import logo from '../assets/integreat-app-logo.png'

type WrapperPropsType = { statusBarHeight: number }

const Wrapper = styled.View`
  flex: 1;
  margin-top: ${(props: WrapperPropsType) => props.statusBarHeight};
`

type AppPropsType = {
  statusBarHeight: number,
  children?: React.Node
}

class Layout extends React.Component<AppPropsType> {
  render () {
    return (
      <Wrapper statusBarHeight={this.props.statusBarHeight}>
        <StatusBar backgroundColor='#fbda16' barStyle='dark-content' />

        {this.props.children}
      </Wrapper>
    )
  }
}

export default Layout
