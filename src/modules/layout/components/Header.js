// @flow

import * as React from 'react'
import logo from '../assets/integreat-app-logo.png'
import styled from 'styled-components'
import { View } from 'react-native'
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import type { NavigationScene } from 'react-navigation'
import type { ThemeType } from 'modules/theme/constants/theme'
import HeaderBackButton from 'react-navigation-stack/dist/views/Header/HeaderBackButton'
import { SearchBar } from 'react-native-elements'

const Horizonal = styled.View`
  flex:1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const HorizonalLeft = styled.View`
  flex:1;
  flex-direction: row;
  align-items: center;
`

const Logo = styled.Image`
  width: 150px;
  height: 50px;
  resize-mode: contain;
`

const Title = styled.Text`
 font-size: 30px;
 color: black;
 margin-left: 10px;
`

const BoxShadow = styled.View`
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${props => props.theme.dimensions.headerHeight};
`

const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={MaterialIcon} iconSize={23} color='black' />
)

const MaterialHeaderButtons = props => {
  return (
    <HeaderButtons
      HeaderButtonComponent={MaterialHeaderButton}
      OverflowIcon={<MaterialIcon name='more-vert' size={23} color='black' />}
      {...props}
    />
  )
}

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

  _getLastScene (scene: NavigationScene): NavigationScene | void {
    return this.props.scenes.find(s => s.index === scene.index - 1)
  }

  goBack = () => {
    // $FlowFixMe
    this.props.scene.descriptor.navigation.goBack(this.props.scene.descriptor.key)
  }

  showSearchBar = () => {
    this.setState({searchActive: true})
  }

  render () {
    if (this.state.searchActive) {
      return <BoxShadow theme={this.props.theme}><HorizonalLeft>
        <HeaderBackButton onPress={this.goBack} />
        <SearchBar lightTheme containerStyle={{'flexGrow': 1}} />
      </HorizonalLeft>
      </BoxShadow>
    }

    let headerTitle = ''

    // $FlowFixMe
    if (this.props.scene.descriptor) {
      const {options} = this.props.scene.descriptor
      headerTitle = options.headerTitle
    }

    return (
      <BoxShadow theme={this.props.theme}>
        <Horizonal>
          <HorizonalLeft>
            {this._getLastScene(this.props.scene) && <HeaderBackButton onPress={this.goBack} />}
            <Logo source={logo} />
            <Title>{headerTitle}</Title>
          </HorizonalLeft>
          <MaterialHeaderButtons>
            <Item title='Seach' iconName='search' onPress={this.showSearchBar} />
            <Item title='Change Language' iconName='language' />
            <Item title='Change Location' iconName='edit-location' show='never' />
            <Item title='Settings' show='never' />
          </MaterialHeaderButtons>
        </Horizonal>
      </BoxShadow>
    )
  }
}

export default Header
