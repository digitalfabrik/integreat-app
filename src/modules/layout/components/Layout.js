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

const Logo = styled.Image`
  flex:1;
  width: 150px;
  resize-mode: contain;
`

const BoxShadow = styled.View`
  elevation: 1;
  background-color: #fafafa;
  height: 60px;
`

type AppPropsType = {
  statusBarHeight: number,
  children: React.Node
}

class Layout extends React.Component<AppPropsType> {
  render () {
    return (
      <Wrapper statusBarHeight={this.props.statusBarHeight}>
        <StatusBar backgroundColor='#fafafa' barStyle='light-content' />
        <BoxShadow>
          <Logo source={logo} />
        </BoxShadow>
        {this.props.children}
      </Wrapper>
    )
  }
}

export default Layout
