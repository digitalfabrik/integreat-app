import { HeaderBackButton } from '@react-navigation/elements'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Share, useWindowDimensions } from 'react-native'
import { HiddenItem, Item } from 'react-navigation-header-buttons'
import styled, { useTheme } from 'styled-components/native'

import { LANDING_ROUTE, LanguageModel, POIS_ROUTE, PoisRouteType, SHARE_SIGNAL_NAME } from 'api-client'
import { DISCLAIMER_ROUTE, SEARCH_ROUTE, SETTINGS_ROUTE } from 'api-client/src/routes'

import { NavigationProps, RouteProps, RoutesParamsType, RoutesType } from '../constants/NavigationTypes'
import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import { AppContext } from '../contexts/AppContextProvider'
import useSnackbar from '../hooks/useSnackbar'
import navigateToLanguageChange from '../navigation/navigateToLanguageChange'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import CustomHeaderButtons from './CustomHeaderButtons'

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

enum HeaderButtonTitle {
  Disclaimer = 'disclaimer',
  Language = 'changeLanguage',
  Location = 'changeLocation',
  Search = 'search',
  Share = 'share',
  Settings = 'settings',
}

type HeaderProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
  showItems?: boolean
  showOverflowItems?: boolean
  languages?: LanguageModel[]
  availableLanguages?: string[]
  shareUrl?: string
}

const Header = ({
  navigation,
  route,
  availableLanguages,
  shareUrl,
  showItems = false,
  showOverflowItems = true,
  languages,
}: HeaderProps): ReactElement | null => {
  const { languageCode } = useContext(AppContext)
  const { t } = useTranslation('layout')
  const theme = useTheme()
  const showSnackbar = useSnackbar()
  const deviceWidth = useWindowDimensions().width
  // Save route/canGoBack to state to prevent it from changing during navigating which would lead to flickering of the title and back button
  const [previousRoute] = useState(navigation.getState().routes[navigation.getState().routes.length - 2])
  const [canGoBack] = useState(navigation.canGoBack())

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
      showSnackbar({ text: 'generalError' })
      reportError(e)
    }
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

  const goToLanguageChange = () => {
    if (availableLanguages?.length === 1 && availableLanguages[0] === languageCode) {
      showSnackbar({ text: 'layout:noTranslation' })
    } else if (languages && availableLanguages) {
      navigateToLanguageChange({ navigation, availableLanguages, languages })
    }
  }

  const visible = showItems && !!goToLanguageChange
  const items = [
    renderItem(HeaderButtonTitle.Search, 'search', visible, () => navigation.navigate(SEARCH_ROUTE)),
    renderItem(HeaderButtonTitle.Language, 'language', visible, goToLanguageChange),
  ]

  const overflowItems = showOverflowItems
    ? [
        ...(shareUrl ? [renderOverflowItem(HeaderButtonTitle.Share, onShare)] : []),
        ...(!buildConfig().featureFlags.fixedCity
          ? [renderOverflowItem(HeaderButtonTitle.Location, () => navigation.navigate(LANDING_ROUTE))]
          : []),
        renderOverflowItem(HeaderButtonTitle.Settings, () => navigation.navigate(SETTINGS_ROUTE)),
        ...(route.name !== DISCLAIMER_ROUTE
          ? [renderOverflowItem(HeaderButtonTitle.Disclaimer, () => navigation.navigate(DISCLAIMER_ROUTE))]
          : []),
      ]
    : []

  const HeaderLeft = canGoBack ? (
    <HeaderBackButton onPress={navigation.goBack} labelVisible={false} tintColor={theme.colors.textColor} />
  ) : (
    <Icon source={buildConfigAssets().appIcon} />
  )

  const getHeaderText = (): string => {
    const currentTitle = (route.params as { title?: string } | undefined)?.title
    if (!previousRoute) {
      // Home/Dashboard: Show current route title, i.e. city name
      return currentTitle ?? ''
    }

    const previousParams = previousRoute.params
    const isPoisDetail = route.name === POIS_ROUTE && (route.params as RoutesParamsType[PoisRouteType]).slug

    // Poi details are not opened in a new route
    if (isPoisDetail) {
      return t('pois')
    }

    const previousRouteTitle = (previousParams as { title?: string } | undefined)?.title
    return previousRouteTitle ?? t(previousRoute.name)
  }

  return (
    <BoxShadow>
      <Horizontal>
        <HorizontalLeft>
          {HeaderLeft}
          <HeaderText allowFontScaling={false} fontSize={deviceWidth * dimensions.fontScaling}>
            {getHeaderText()}
          </HeaderText>
        </HorizontalLeft>
        <CustomHeaderButtons cancelLabel={t('cancel')} items={items} overflowItems={overflowItems} />
      </Horizontal>
    </BoxShadow>
  )
}

export default Header
