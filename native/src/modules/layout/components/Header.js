// @flow

import type { Node } from 'react'
import React from 'react'
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
import { DISCLAIMER_ROUTE, SEARCH_ROUTE, SETTINGS_ROUTE } from 'api-client/src/routes'
import navigateToLanding from '../../navigation/navigateToLanding'

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

const HeaderText: StyledComponent<{||}, ThemeType, *> = styled.Text`
  flex: 1;
  flex-direction: column;
  text-align-vertical: center;
  height: 50px;
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontBold};
`

const BoxShadow: StyledComponent<{||}, ThemeType, *> = styled.View`
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.18;
  shadow-radius: 1.00px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${dimensions.headerHeight}px;
`

export type PropsType = {|
  ...StackHeaderProps,
  t: TFunction,
  theme: ThemeType,
  peeking: boolean,
  categoriesAvailable: boolean,
  goToLanguageChange?: () => void,
  routeCityModel?: CityModel,
  language: string,
  shareUrl: ?string,
  dispatch: Dispatch<StoreActionType>
|}

const Header = (props: PropsType) => {
  const {
    navigation,
    dispatch,
    shareUrl,
    language,
    t,
    routeCityModel,
    theme,
    goToLanguageChange,
    peeking,
    categoriesAvailable
  } = props

  const canGoBackInStack = (): boolean => {
    return !!props.previous
  }

  const goBackInStack = () => {
    navigation.goBack()
  }

  const goToLanding = () => {
    // $FlowFixMe Navigation type of the header does not match that of screens.
    navigateToLanding({ dispatch, navigation })
  }

  const goToSettings = () => {
    navigation.navigate(SETTINGS_ROUTE)
  }

  const onShare = async () => {
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

  const goToSearch = () => {
    navigation.navigate(SEARCH_ROUTE)
  }

  const goToDisclaimer = () => {
    if (!routeCityModel) {
      throw new Error('Impossible to go to disclaimer route if no city model is defined')
    }
    const cityCode = routeCityModel.code
    navigation.navigate(DISCLAIMER_ROUTE, { cityCode, languageCode: language })
  }

  const cityDisplayName = () => {
    if (!routeCityModel) {
      return ''
    }
    const description = routeCityModel.prefix ? ` (${routeCityModel.prefix})` : ''
    return `${routeCityModel.sortingName}${description}`
  }

  const renderItem = (
    title: string, iconName?: string, show: 'never' | 'always',
    onPress: ?() => void | Promise<void>, accessibilityLabel: string
  ): Node => {
    const buttonStyle = onPress ? {} : { color: theme.colors.textSecondaryColor }

    return <Item title={title} accessibilityLabel={accessibilityLabel} iconName={iconName} show={show}
                 onPress={onPress} buttonStyle={buttonStyle} />
  }

  const showShare = !!(shareUrl)
  const showChangeLocation = !buildConfig().featureFlags.fixedCity

  return (
    <BoxShadow theme={theme}>
      <Horizontal>
        <HorizontalLeft>
          {canGoBackInStack()
            ? <HeaderBackButton onPress={goBackInStack} labelVisible={false} />
            : <Icon source={buildConfigAssets().appIcon} />}
          {routeCityModel &&
          <HeaderText allowFontScaling={false} theme={theme}>{cityDisplayName()}</HeaderText>}
        </HorizontalLeft>
        <MaterialHeaderButtons cancelLabel={t('cancel')} theme={theme}>
          {!peeking && categoriesAvailable &&
          renderItem(t('search'), 'search', 'always', goToSearch, t('search'))}
          {!peeking && goToLanguageChange &&
          renderItem(t('changeLanguage'), 'language', 'always', goToLanguageChange, t('changeLanguage'))}
          {showShare && renderItem(t('share'), undefined, 'never', onShare, t('share'))}
          {showChangeLocation &&
          renderItem(t('changeLocation'), undefined, 'never', goToLanding, t('changeLocation'))}
          {renderItem(t('settings'), undefined, 'never', goToSettings, t('settings'))}
          {routeCityModel && renderItem(t('disclaimer'), undefined, 'never', goToDisclaimer, t('disclaimer'))}
        </MaterialHeaderButtons>
      </Horizontal>
    </BoxShadow>
  )
}

export default Header
