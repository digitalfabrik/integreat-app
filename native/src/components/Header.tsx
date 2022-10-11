import { HeaderBackButton } from '@react-navigation/elements'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Share, useWindowDimensions } from 'react-native'
import { HiddenItem, Item } from 'react-navigation-header-buttons'
import styled, { useTheme } from 'styled-components/native'

import { CityModel, LANDING_ROUTE, SHARE_SIGNAL_NAME } from 'api-client'
import { DISCLAIMER_ROUTE, SEARCH_ROUTE, SETTINGS_ROUTE } from 'api-client/src/routes'

import { NavigationPropType, RoutePropType, RoutesType } from '../constants/NavigationTypes'
import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useSnackbar from '../hooks/useSnackbar'
import { forceNewlineAfterChar } from '../utils/forceNewLineAfterChar'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import MaterialHeaderButtons from './MaterialHeaderButtons'

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
const HeaderText = styled.Text<{ fontSize: number }>`
  flex: 1;
  flex-direction: column;
  font-size: ${props => Math.min(props.fontSize, dimensions.headerTextSize)}px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`
const BoxShadow = styled.View`
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.18;
  shadow-radius: 1px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${dimensions.headerHeight}px;
`

type HeaderPropsType = {
  route: RoutePropType<RoutesType>
  navigation: NavigationPropType<RoutesType>
  peeking: boolean
  categoriesAvailable: boolean
  goToLanguageChange?: () => void
  routeCityModel?: CityModel
  language: string
}

enum HeaderButtonTitle {
  Disclaimer = 'disclaimer',
  Language = 'changeLanguage',
  Location = 'changeLocation',
  Search = 'search',
  Share = 'share',
  Settings = 'settings',
}

const Header = (props: HeaderPropsType): ReactElement => {
  const { t } = useTranslation('layout')
  const theme = useTheme()
  const { route, navigation, language, routeCityModel, goToLanguageChange, peeking, categoriesAvailable } = props

  const shareUrl = route.params?.shareUrl

  const goToLanding = () => {
    navigation.navigate(LANDING_ROUTE)
  }

  const goToSettings = () => {
    navigation.navigate(SETTINGS_ROUTE)
  }

  const showSnackbar = useSnackbar()
  const onShare = async () => {
    if (!shareUrl) {
      // The share option should only be shown if there is a shareUrl
      return
    }

    const message = t('shareMessage', {
      message: shareUrl,
      interpolation: {
        escapeValue: false,
      },
    })
    sendTrackingSignal({
      signal: {
        name: SHARE_SIGNAL_NAME,
        url: shareUrl,
      },
    })

    try {
      await Share.share({
        message,
        title: buildConfig().appName,
      })
    } catch (e) {
      showSnackbar(t('generalError'))
      reportError(e as Error)
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
    navigation.navigate(DISCLAIMER_ROUTE, {
      cityCode,
      languageCode: language,
    })
  }

  const deviceWidth = useWindowDimensions().width

  const cityDisplayName = (): string => {
    if (!routeCityModel) {
      return ''
    }

    const description = routeCityModel.prefix ? ` (${routeCityModel.prefix})` : ''
    const cityNameLength = routeCityModel.sortingName.length
    return cityNameLength < deviceWidth / dimensions.headerTextSize
      ? `${routeCityModel.sortingName}${description}`
      : `${forceNewlineAfterChar(routeCityModel.sortingName, '-')}${description}`
  }

  const renderItem = (title: string, iconName: string, visible: boolean, onPress?: () => void): ReactElement => (
    <Item
      key={title}
      disabled={!visible}
      title={t(title)}
      iconName={iconName}
      onPress={visible ? onPress : () => undefined}
      style={{ opacity: visible ? 1 : 0 }}
      accessibilityLabel={t(title)}
    />
  )

  const renderOverflowItem = (title: string, onPress: () => void): ReactElement => (
    <HiddenItem key={title} title={t(title)} onPress={onPress} />
  )

  const showShare = !!shareUrl
  const showChangeLocation = !buildConfig().featureFlags.fixedCity
  const showItems = !peeking && !!goToLanguageChange && categoriesAvailable
  const canGoBack = navigation.getState().index > 0

  return (
    <BoxShadow theme={theme}>
      <Horizontal>
        <HorizontalLeft>
          {canGoBack ? (
            <HeaderBackButton onPress={navigation.goBack} labelVisible={false} />
          ) : (
            <Icon source={buildConfigAssets().appIcon} />
          )}
          {routeCityModel && (
            <HeaderText allowFontScaling={false} theme={theme} fontSize={deviceWidth * dimensions.fontScaling}>
              {cityDisplayName()}
            </HeaderText>
          )}
        </HorizontalLeft>
        <MaterialHeaderButtons
          cancelLabel={t('cancel')}
          theme={theme}
          items={[
            renderItem(HeaderButtonTitle.Search, 'search', showItems, goToSearch),
            renderItem(HeaderButtonTitle.Language, 'language', showItems, goToLanguageChange),
          ]}
          overflowItems={[
            showShare && renderOverflowItem(HeaderButtonTitle.Share, onShare),
            showChangeLocation && renderOverflowItem(HeaderButtonTitle.Location, goToLanding),
            renderOverflowItem(HeaderButtonTitle.Settings, goToSettings),
            routeCityModel && renderOverflowItem(HeaderButtonTitle.Disclaimer, goToDisclaimer),
          ]}
        />
      </Horizontal>
    </BoxShadow>
  )
}

export default Header
