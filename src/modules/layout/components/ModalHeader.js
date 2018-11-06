// @flow

import * as React from 'react'
import styled from 'styled-components'
import type { NavigationScene } from 'react-navigation'
import type { ThemeType } from 'modules/theme/constants/theme'
import HeaderBackButton from 'react-navigation-stack/dist/views/Header/HeaderBackButton'

const Horizontal = styled.View`
  flex:1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const HorizontalLeft = styled.View`
  flex:1;
  flex-direction: row;
  align-items: center;
`

const Title = styled.Text`
 font-size: 30px;
 color: black;
 margin-left: 10px;
`

const BoxShadow = styled.View`
  background-color: transparent;
  height: ${props => props.theme.dimensions.modalHeaderHeight};
`

type PropsType = {
  scene: NavigationScene,
  scenes: Array<NavigationScene>,
  theme: ThemeType
}

type StateType = {
  searchActive: boolean
}

class Header extends React.PureComponent<PropsType, StateType> {
  constructor () {
    super()
    this.state = {searchActive: false}
  }

  getDescriptor (): { [key: string]: any } {
    // $FlowFixMe
    return this.props.scene.descriptor
  }

  goBack = () => {
    this.getDescriptor().navigation.goBack(null)
  }

  render () {
    const headerTitle = this.getDescriptor().headerTitle || ''

    return (
      <BoxShadow theme={this.props.theme}>
        <Horizontal>
          <HorizontalLeft>
            <HeaderBackButton onPress={this.goBack} />
            <Title>{headerTitle}</Title>
          </HorizontalLeft>
        </Horizontal>
      </BoxShadow>
    )
  }
}

export default Header
