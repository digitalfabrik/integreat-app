// @flow

import * as React from 'react'
import { Share } from 'react-native'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import { Item } from 'react-navigation-header-buttons'
import { HeaderBackButton, type StackHeaderProps } from '@react-navigation/stack'
import type { ThemeType } from '../../theme/constants'
import type { TFunction } from 'react-i18next'
import { CityModel } from 'api-client'
import MaterialHeaderButtons from './MaterialHeaderButtons'
import buildConfig, { buildConfigAssets } from '../../app/constants/buildConfig'
import dimensions from '../../theme/constants/dimensions'
import type { StoreActionType } from '../../app/StoreActionType'
import type { Dispatch } from 'redux'
import {
  DISCLAIMER_ROUTE,
  SEARCH_MODAL_ROUTE,
  SETTINGS_ROUTE
} from '../../app/constants/NavigationTypes'
import { cityContentUrl } from '../../common/url'
import createNavigateToLanding from '../../app/createNavigateToLanding'

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
  ...StackHeaderProps,
  t: TFunction,
  theme: ThemeType,
  peeking: boolean,
  categoriesAvailable: boolean,
  goToLanguageChange?: () => void,
  routeCityModel?: CityModel,
  language: string,
  dispatch: Dispatch<StoreActionType>
|}

class Header extends React.PureComponent<PropsType> {
  canGoBackInStack (): boolean {
    return !!this.props.previous
  }

  goBackInStack = () => {
    this.props.navigation.goBack()
  }

  goToLanding = () => {
    const { navigation, dispatch } = this.props
    // $FlowFixMe Navigation type of the header does not match that of screens.
    createNavigateToLanding(dispatch, navigation)()
  }

  goToSettings = () => {
    this.props.navigation.navigate(SETTINGS_ROUTE)
  }

  onShare = async () => {
    const { scene, t } = this.props
    const shareUrl = scene.route.params?.shareUrl
    if (!shareUrl) { // The share option should only be shown if there is a shareUrl
      return
    }

    const message = t('shareMessage', {
      message: shareUrl,
      interpolation: { escapeValue: false }
    })

    try {
      await Share.share({
        message,
        title: buildConfig().appName
      })
    } catch (e) {
      alert(e.message)
    }
  }

  goToSearch = () => {
    this.props.navigation.navigate(SEARCH_MODAL_ROUTE)
  }

  goToDisclaimer = () => {
    const { routeCityModel, language } = this.props
    if (!routeCityModel) {
      throw new Error('Impossible to go to disclaimer route if no city model is defined')
    }
    const shareUrl = cityContentUrl({ cityCode: routeCityModel.code, languageCode: language, route: DISCLAIMER_ROUTE })
    this.props.navigation.navigate(DISCLAIMER_ROUTE, { shareUrl })
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
    const { routeCityModel, scene, t, theme, goToLanguageChange, peeking, categoriesAvailable } = this.props
    const shareUrl = scene.route.params?.shareUrl || null

    return <BoxShadow theme={theme}>
      <Horizontal>
        <HorizontalLeft>
          {this.canGoBackInStack()
            ? <HeaderBackButton onPress={this.goBackInStack} labelVisible={false} />
            : <Icon source={buildConfigAssets().appIcon} />}
          {routeCityModel &&
          <HeaderText allowFontScaling={false} theme={theme}>{this.cityDisplayName(routeCityModel)}</HeaderText>}
        </HorizontalLeft>
        <MaterialHeaderButtons cancelLabel={t('cancel')} theme={theme}>
          {!peeking && categoriesAvailable &&
          this.renderItem(t('search'), 'search', 'always', this.goToSearch, t('search'))}
          {!peeking && goToLanguageChange &&
          this.renderItem(t('changeLanguage'), 'language', 'always', goToLanguageChange, t('changeLanguage'))}
          {shareUrl && this.renderItem(t('share'), undefined, 'never', this.onShare, t('share'))}
          {this.renderItem(t('changeLocation'), undefined, 'never', this.goToLanding, t('changeLocation'))}
          {this.renderItem(t('settings'), undefined, 'never', this.goToSettings, t('settings'))}
          {routeCityModel && this.renderItem(t('disclaimer'), undefined, 'never', this.goToDisclaimer, t('disclaimer'))}
        </MaterialHeaderButtons>
      </Horizontal>
    </BoxShadow>
  }
}

export default Header
