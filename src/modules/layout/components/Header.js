// @flow

import * as React from 'react'
import { Platform, Share } from 'react-native'
import logo from '../assets/integreat-app-logo.png'
import styled, { type StyledComponent } from 'styled-components/native'
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import HeaderBackButton from 'react-navigation-stack/lib/module/views/Header/HeaderBackButton'

import type { NavigationScene, NavigationScreenProp, NavigationDescriptor } from 'react-navigation'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { TFunction } from 'react-i18next'
import type { CategoriesRouteMappingType } from '../../app/StateType'

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

const BoxShadow: StyledComponent<{}, ThemeType, *> = styled.View`
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.18;
  shadow-radius: 1.00px;
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
  navigation: NavigationScreenProp<*>,
  scene: NavigationScene,
  scenes: Array<NavigationScene>,
  t: TFunction,
  theme: ThemeType,
  peeking: boolean,
  navigateToLanding: () => void,
  routeKey: string
|}

class Header extends React.PureComponent<PropsType> {
  canGoBackInStack (): boolean {
    return !!this.getLastSceneInStack()
  }

  getLastSceneInStack (): NavigationScene | void {
    return this.props.scenes.find((s: NavigationScene) => s.index === this.props.scene.index - 1)
  }

  getDescriptor (): NavigationDescriptor {
    const descriptor = this.props.scene.descriptor
    if (!descriptor) {
      throw new Error('Descriptor is not defined')
    }
    return descriptor
  }

  goBackInStack = () => {
    this.props.navigation.goBack(this.getDescriptor().key)
  }

  goToLanding = () => {
    this.props.navigateToLanding()
  }

  goToSettings = () => {
    this.props.navigation.navigate('Settings')
  }

  goToLanguageChange = () => {
    const { navigation, routeKey } = this.props
    navigation.navigate({
      routeName: 'ChangeLanguageModal', params: { routeKey }
    })
  }

  isPeeking (): boolean {
    return this.props.peeking
  }

  onShare = async () => {
    const { navigation, t } = this.props
    const sharePath: ?string = navigation.getParam('sharePath')
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
    this.props.navigation.navigate('SearchModal')
  }

  render () {
    const { navigation, t, theme } = this.props
    const sharePath = navigation.getParam('sharePath')

    return <BoxShadow theme={theme}>
      <Horizontal>
        <HorizontalLeft>
          {this.canGoBackInStack() && <HeaderBackButton onPress={this.goBackInStack} />}
          <Logo source={logo} />
        </HorizontalLeft>
        <MaterialHeaderButtons>
          {!this.isPeeking() &&
          <Item title='Search' iconName='search' onPress={this.goToSearch} />}
          {!this.isPeeking() &&
          <Item title='Change Language' iconName='language' onPress={this.goToLanguageChange} />}
          {sharePath && <Item title={t('share')} show='never' onPress={this.onShare} />}
          <Item title='Change Location' show='never' iconName='edit-location' onPress={this.goToLanding} />
          <Item title={t('settings')} show='never' onPress={this.goToSettings} />
        </MaterialHeaderButtons>
      </Horizontal>
    </BoxShadow>
  }
}

export default Header
