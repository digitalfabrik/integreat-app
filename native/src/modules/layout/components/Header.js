// @flow

import React, { useCallback } from 'react'
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
import type { Node } from 'react'
import {
  DISCLAIMER_ROUTE,
  SEARCH_MODAL_ROUTE,
  SETTINGS_ROUTE
} from '../../app/constants/NavigationTypes'
import { cityContentUrl, url } from '../../common/url'
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

type PropsType = {|
  ...StackHeaderProps,
  t: TFunction,
  theme: ThemeType,
  peeking: boolean,
  categoriesAvailable: boolean,
  goToLanguageChange?: () => void,
  routeCityModel?: CityModel,
  language: string,
  path: string | null,
  routeMappingType: string | null,
  dispatch: Dispatch<StoreActionType>
|}

const Header = (props: PropsType) => {
  const canGoBackInStack = useCallback(() => {
    return !!props.previous
  })

  const goBackInStack = useCallback(() => {
    props.navigation.goBack()
  })

  const goToLanding = useCallback(() => {
    const { navigation, dispatch } = props
    // $FlowFixMe Navigation type of the header does not match that of screens.
    createNavigateToLanding(dispatch, navigation)()
  })

  const goToSettings = useCallback(() => {
    props.navigation.navigate(SETTINGS_ROUTE)
  })

  const onShare = useCallback(async () => {
    const { scene, t, path, language, routeMappingType } = props
    const shareUrlFromScene = scene.route.params?.shareUrl

    if (!shareUrlFromScene && !path && !routeMappingType) { // The share option should only be shown if there is a shareUrl
      return
    }

    let shareUrl
    if (path) {
      shareUrl = url(path)
    } else if (routeMappingType && routeCityModel) { // for overview pages of news, events and pois, information should be moved to routeMappings in redux store TODO in 450
      shareUrl = cityContentUrl({ cityCode: routeCityModel.name, languageCode: language, route: routeMappingType, path: null })
    } else { // for routes not saved in redux store eg. offers
      shareUrl = shareUrlFromScene
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
  })

  const goToSearch = useCallback(() => {
    props.navigation.navigate(SEARCH_MODAL_ROUTE)
  })

  const goToDisclaimer = useCallback(() => {
    const { routeCityModel, language } = props
    if (!routeCityModel) {
      throw new Error('Impossible to go to disclaimer route if no city model is defined')
    }
    const shareUrl = cityContentUrl({ cityCode: routeCityModel.code, languageCode: language, route: DISCLAIMER_ROUTE })
    props.navigation.navigate(DISCLAIMER_ROUTE, { shareUrl })
  })

  const cityDisplayName = useCallback((cityModel: CityModel) => {
    const description = cityModel.prefix ? ` (${cityModel.prefix})` : ''
    return `${cityModel.sortingName}${description}`
  })

  const renderItem = useCallback((
    title: string, iconName?: string, show: 'never' | 'always',
    onPress: ?() => void | Promise<void>, accessibilityLabel: string
  ): Node => {
    const { theme } = props
    const buttonStyle = onPress ? {} : { color: theme.colors.textSecondaryColor }

    return <Item title={title} accessibilityLabel={accessibilityLabel} iconName={iconName} show={show}
                 onPress={onPress} buttonStyle={buttonStyle} />
  })

  const { routeCityModel, scene, t, theme, goToLanguageChange, peeking, categoriesAvailable, path, routeMappingType } = props
  const showShare = !!(scene.route.params?.shareUrl || path || routeMappingType)
  const showChangeLocation = !buildConfig().featureFlags.fixedCity

  return (
    <BoxShadow theme={theme}>
      <Horizontal>
        <HorizontalLeft>
          {canGoBackInStack()
            ? <HeaderBackButton onPress={goBackInStack} labelVisible={false} />
            : <Icon source={buildConfigAssets().appIcon} />}
          {routeCityModel &&
          <HeaderText allowFontScaling={false} theme={theme}>{cityDisplayName(routeCityModel)}</HeaderText>}
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
