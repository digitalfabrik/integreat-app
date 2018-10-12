// @flow

import * as React from 'react'
import logo from '../assets/integreat-app-logo.png'
import styled from 'styled-components'
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import type { NavigationScene, NavigationScreenProp } from 'react-navigation'
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

const ThemedSearchBar = styled(SearchBar).attrs({
  containerStyle: props => ({
    flexGrow: 1,
    backgroundColor: props.theme.colors.backgroundAccentColor,
    borderTopColor: props.theme.colors.backgroundAccentColor,
    borderBottomColor: props.theme.colors.backgroundAccentColor
  }),
  inputContainerStyle: props => ({
    backgroundColor: props.theme.colors.backgroundColor
  }),
  inputStyle: props => ({
    backgroundColor: props.theme.colors.backgroundColor
  })
})``

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

  canGoBackInStack (): boolean {
    return !!this.getLastSceneInStack()
  }

  getLastSceneInStack (): NavigationScene | void {
    return this.props.scenes.find((s: NavigationScene) => s.index === this.props.scene.index - 1)
  }

  getDescriptor (): { [key: string]: any } {
    // $FlowFixMe
    return this.props.scene.descriptor
  }

  getNavigation (): NavigationScreenProp<*> {
    return this.getDescriptor().navigation
  }

  goBackInStack = () => {
    this.getNavigation().goBack(this.getDescriptor().key)
  }

  showSearchBar = () => {
    this.setState(state => ({...state, searchActive: true}))
  }

  closeSearchBar = () => {
    this.setState(state => ({...state, searchActive: false}))
  }

  goToLanding = () => {
    this.getNavigation().navigate('Landing')
  }

  goToLanguageChange = () => {
    this.getNavigation().navigate('ChangeLanguageModal')
  }

  render () {
    if (this.state.searchActive) {
      return <BoxShadow theme={this.props.theme}><HorizonalLeft>
        <HeaderBackButton onPress={this.closeSearchBar} />
        <ThemedSearchBar />
      </HorizonalLeft>
      </BoxShadow>
    }

    const headerTitle = this.getDescriptor().headerTitle || ''

    return (
      <BoxShadow theme={this.props.theme}>
        <Horizonal>
          <HorizonalLeft>
            {this.canGoBackInStack() && <HeaderBackButton onPress={this.goBackInStack} />}
            <Logo source={logo} />
            <Title>{headerTitle}</Title>
          </HorizonalLeft>
          <MaterialHeaderButtons>
            <Item title='Search' iconName='search' onPress={this.showSearchBar} />
            <Item title='Change Language' iconName='language' onPress={this.goToLanguageChange} />
            <Item title='Change Location' iconName='edit-location' onPress={this.goToLanding} />
            <Item title='Settings' show='never' onPress={console.warn} />
          </MaterialHeaderButtons>
        </Horizonal>
      </BoxShadow>
    )
  }
}

export default Header
