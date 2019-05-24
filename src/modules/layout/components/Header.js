// @flow

import * as React from 'react'
import { Platform, Share } from 'react-native'
import logo from '../assets/integreat-app-logo.png'
import styled from 'styled-components/native'
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import HeaderBackButton from 'react-navigation-stack/lib/module/views/Header/HeaderBackButton'

import type { NavigationScene, NavigationScreenProp } from 'react-navigation'
import type { ThemeType } from 'modules/theme/constants/theme'
import type { TFunction } from 'react-i18next'

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
  elevation: 1;
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

type PropsType = {|
  scene: NavigationScene,
  scenes: Array<NavigationScene>,
  t: TFunction,
  theme: ThemeType,
  routeMapping: {
    [key: string]: {
      root: string
    }
  },
  availableLanguages: ?Array<string>
|}

class Header extends React.PureComponent<PropsType> {
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

  goToLanding = () => {
    this.getNavigation().navigate('Landing')
  }

  goToLanguageChange = () => {
    this.getNavigation().navigate({
      routeName: 'ChangeLanguageModal',
      params: {
        availableLanguages: this.props.availableLanguages
      }
    })
  }

  onShare = async () => {
    const {t} = this.props
    const sharePath: ?string = this.getNavigation().getParam('sharePath')
    if (!sharePath) {
      return console.error('sharePath is undefined')
    }
    const url = `https://integreat.app${sharePath}`
    const shareMessage = t('shareMessage')
    const message: string = Platform.select({
      android: `${shareMessage} ${url}`,
      ios: shareMessage
    })

    try {
      await Share.share({
        message,
        title: 'Integreat App',
        url
      })
    } catch (e) {
      alert(e.message)
    }
  }

  goToSearch = () => {
    this.getNavigation().navigate({
      routeName: 'SearchModal'
    })
  }

  render () {
    const {t, theme} = this.props
    const headerTitle = this.getDescriptor().headerTitle || ''
    const sharePath = this.getNavigation().getParam('sharePath')

    return <BoxShadow theme={theme}>
      <Horizontal>
        <HorizontalLeft>
          {this.canGoBackInStack() && <HeaderBackButton onPress={this.goBackInStack} />}
          <Logo source={logo} />
          <Title>{headerTitle}</Title>
        </HorizontalLeft>
        <MaterialHeaderButtons>
          <Item title='Search' iconName='search' onPress={this.goToSearch} />
          <Item title='Change Language' iconName='language' onPress={this.goToLanguageChange} />
          {sharePath && <Item title={t('share')} show='never' onPress={this.onShare} />}
          <Item title='Change Location' show='never' iconName='edit-location' onPress={this.goToLanding} />
          <Item title='Settings' show='never' onPress={console.warn} />
        </MaterialHeaderButtons>
      </Horizontal>
    </BoxShadow>
  }
}

export default Header
