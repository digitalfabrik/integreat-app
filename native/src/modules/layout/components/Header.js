// @flow

import * as React from 'react'
import { Share } from 'react-native'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import { Item } from 'react-navigation-header-buttons'
import { HeaderBackButton } from 'react-navigation-stack'
import type { NavigationDescriptor } from 'react-navigation'
import type { NavigationStackProp, NavigationStackScene } from 'react-navigation-stack'
import type { ThemeType } from '../../theme/constants'
import type { TFunction } from 'react-i18next'
import { CityModel } from 'api-client'
import MaterialHeaderButtons from './MaterialHeaderButtons'
import buildConfig, { buildConfigAssets } from '../../app/constants/buildConfig'
import Url from 'url-parse'
import dimensions from '../../theme/constants/dimensions'

const Horizontal = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const HorizontalLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const Icon = styled.Image`
  width: 70px;
  height: 50px;
  resize-mode: contain;
`

const HeaderText: StyledComponent<{}, ThemeType, *> = styled.Text`
  flex: 1;
  flex-direction: column;
  text-align-vertical: center;
  height: 50px;
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontBold};
`

const BoxShadow: StyledComponent<{}, ThemeType, *> = styled.View`
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.18;
  shadow-radius: 1.00px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${dimensions.headerHeight}px;
`

type PropsType = {|
  navigation: NavigationStackProp<*>,
  scene: NavigationStackScene,
  scenes: Array<NavigationStackScene>,
  t: TFunction,
  theme: ThemeType,
  language: string,
  peeking: boolean,
  categoriesAvailable: boolean,
  navigateToLanding: () => void,
  goToLanguageChange?: () => void,
  routeCityModel?: CityModel
|}

class Header extends React.PureComponent<PropsType> {
  canGoBackInStack (): boolean {
    return !!this.getLastSceneInStack()
  }

  getLastSceneInStack (): NavigationStackScene | void {
    return this.props.scenes.find((s: NavigationStackScene) => s.index === this.props.scene.index - 1)
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

  onShare = async () => {
    const { navigation, t } = this.props
    const sharePath: string = navigation.getParam('sharePath')
    const shareBaseUrl = new Url(buildConfig().shareBaseUrl)
    shareBaseUrl.set('pathname', sharePath)
    const message = t('shareMessage', {
      message: shareBaseUrl.href,
      interpolation: { escapeValue: false }
    })

    try {
      await Share.share({
        message,
        title: 'Integreat App'
      })
    } catch (e) {
      alert(e.message)
    }
  }

  goToSearch = () => {
    this.props.navigation.navigate('SearchModal')
  }

  goToDisclaimer = () => {
    const cityName = this.props.routeCityModel?.name
    this.props.navigation.navigate('Disclaimer', { cityName })
  }

  cityDisplayName = (cityModel: CityModel) => {
    const description = cityModel.prefix ? ` (${cityModel.prefix})` : ''
    return `${cityModel.sortingName}${description}`
  }

  renderItem (
    title: string, iconName?: string, show: 'never' | 'always',
    onPress: ?() => void | Promise<void>, accessibilityLabel: string
  ): React.Node {
    const { theme } = this.props
    const buttonStyle = onPress ? {} : { color: theme.colors.textSecondaryColor }

    return <Item title={title} accessibilityLabel={accessibilityLabel} iconName={iconName} show={show}
                 onPress={onPress} buttonStyle={buttonStyle} />
  }

  render () {
    const { routeCityModel, navigation, t, theme, goToLanguageChange, peeking, categoriesAvailable } = this.props
    const sharePath = navigation.getParam('sharePath')

    return <BoxShadow theme={theme}>
      <Horizontal>
        <HorizontalLeft>
          {this.canGoBackInStack() ? <HeaderBackButton onPress={this.goBackInStack} />
            : <Icon source={buildConfigAssets().appIcon} />}
          {routeCityModel &&
          <HeaderText allowFontScaling={false} theme={theme}>{this.cityDisplayName(routeCityModel)}</HeaderText>}
        </HorizontalLeft>
        <MaterialHeaderButtons cancelLabel={t('cancel')} theme={theme}>
          {!peeking && categoriesAvailable &&
          this.renderItem(t('search'), 'search', 'always', this.goToSearch, t('search'))}
          {!peeking && goToLanguageChange &&
          this.renderItem(t('changeLanguage'), 'language', 'always', goToLanguageChange, t('changeLanguage'))}
          {sharePath && this.renderItem(t('share'), undefined, 'never', this.onShare, t('share'))}
          {this.renderItem(t('changeLocation'), undefined, 'never', this.goToLanding, t('changeLocation'))}
          {this.renderItem(t('settings'), undefined, 'never', this.goToSettings, t('settings'))}
          {this.renderItem(t('disclaimer'), undefined, 'never', this.goToDisclaimer, t('disclaimer'))}
        </MaterialHeaderButtons>
      </Horizontal>
    </BoxShadow>
  }
}

export default Header
