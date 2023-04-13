import { HeaderBackButton } from '@react-navigation/elements'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Share, useWindowDimensions } from 'react-native'
import { HiddenItem, Item } from 'react-navigation-header-buttons'
import styled from 'styled-components/native'

import { CityModel, LANDING_ROUTE, LanguageModel, SHARE_SIGNAL_NAME } from 'api-client'
import { DISCLAIMER_ROUTE, SEARCH_ROUTE, SETTINGS_ROUTE } from 'api-client/src/routes'

import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useCityAppContext from '../hooks/useCityAppContext'
import useLoadCityContent from '../hooks/useLoadCityContent'
import useSnackbar from '../hooks/useSnackbar'
import navigateToLanguageChange from '../navigation/navigateToLanguageChange'
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
  city?: CityModel
  languages?: LanguageModel[]
  availableLanguages?: string[]
  shareUrl?: string
  isHome: boolean | null
}

const Header = ({
  navigation,
  route,
  availableLanguages,
  shareUrl,
  showItems = false,
  city,
  languages,
  isHome,
}: HeaderProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const showSnackbar = useSnackbar()
  const deviceWidth = useWindowDimensions().width

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

  const cityDisplayName = (city: CityModel) => {
    const cityType = city.prefix ? ` (${city.prefix})` : ''
    const shortCityName = city.sortingName.length < deviceWidth / dimensions.headerTextSize
    return shortCityName
      ? `${city.sortingName}${cityType}`
      : `${forceNewlineAfterChar(city.sortingName, '-')}${cityType}`
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

  const goToLanguageChange = () =>
    languages && availableLanguages && navigateToLanguageChange({ navigation, availableLanguages, languages })

  const visible = showItems && !!goToLanguageChange
  const items = [
    renderItem(HeaderButtonTitle.Search, 'search', visible, () => navigation.navigate(SEARCH_ROUTE)),
    renderItem(HeaderButtonTitle.Language, 'language', visible, goToLanguageChange),
  ]

  const overflowItems = [
    ...(shareUrl ? [renderOverflowItem(HeaderButtonTitle.Share, onShare)] : []),
    ...(!buildConfig().featureFlags.fixedCity
      ? [renderOverflowItem(HeaderButtonTitle.Location, () => navigation.navigate(LANDING_ROUTE))]
      : []),
    renderOverflowItem(HeaderButtonTitle.Settings, () => navigation.navigate(SETTINGS_ROUTE)),
    ...(route.name !== DISCLAIMER_ROUTE
      ? [renderOverflowItem(HeaderButtonTitle.Disclaimer, () => navigation.navigate(DISCLAIMER_ROUTE))]
      : []),
  ]

  const HeaderLeft =
    isHome !== null &&
    (isHome ? (
      <Icon source={buildConfigAssets().appIcon} />
    ) : (
      <HeaderBackButton onPress={navigation.goBack} labelVisible={false} />
    ))

  const { cityCode, languageCode } = useCityAppContext()
  const { data } = useLoadCityContent({ cityCode, languageCode })

  const getHeaderText = (): string => {
    if (!city) {
      return ''
    }
    const routes = navigation.getState().routes
    const cityName = cityDisplayName(city)
    if (isHome) {
      return cityName
    }

    const previousRoute = routes[routes.length - 2]
    const currentRoute = routes[routes.length - 1]
    const isInCategories = currentRoute?.name === 'categories'
    const isInNews = currentRoute?.name === 'news'
    const isInEvents = currentRoute?.name === 'events'
    const isInOffers = previousRoute?.name === 'offers'
    const isInPois = currentRoute?.name === 'locations'

    // in news and pois, we don't add to the stack for navigation, we just change the parameters of the top of the stack
    if (!isInNews && !isInPois) {
      const levelsDisplayingCityName = 2
      if (routes.length <= levelsDisplayingCityName) {
        return cityDisplayName(city)
      }
    }

    if (isInCategories) {
      if (previousRoute?.name !== 'categories') {
        return ''
      }
      const currentPath = (currentRoute.params as { path: string }).path
      const category = data?.categories.findCategoryByPath(currentPath)
      const parentCategory = data?.categories.findCategoryByPath(category?.parentPath ?? '')
      return parentCategory?.title ?? ''
    }
    if (isInNews) {
      const isInNewsOverview = !(currentRoute.params as { newsId: string }).newsId
      if (isInNewsOverview) {
        return cityName
      }
      return t('news')
    }
    if (isInEvents) {
      return t('events')
    }
    if (isInOffers) {
      return t('offers')
    }
    if (isInPois) {
      const isInPoisOverview = !(currentRoute.params as { slug: string }).slug
      if (isInPoisOverview) {
        return cityName
      }
      return t('pois')
    }
    return ''
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
        <MaterialHeaderButtons cancelLabel={t('cancel')} items={items} overflowItems={overflowItems} />
      </Horizontal>
    </BoxShadow>
  )
}

export default Header
