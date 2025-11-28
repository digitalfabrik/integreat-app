import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Share } from 'react-native'
import { HiddenItem, Item } from 'react-navigation-header-buttons'
import styled, { useTheme } from 'styled-components/native'

import {
  CATEGORIES_ROUTE,
  CategoriesRouteType,
  EVENTS_ROUTE,
  EventsRouteType,
  getSlugFromPath,
  LANDING_ROUTE,
  NEWS_ROUTE,
  POIS_ROUTE,
  PoisRouteType,
  SHARE_SIGNAL_NAME,
  DISCLAIMER_ROUTE,
  SEARCH_ROUTE,
  SETTINGS_ROUTE,
} from 'shared'
import { LanguageModel, FeedbackRouteType } from 'shared/api'
import { config } from 'translations'

import { NavigationProps, RouteProps, RoutesParamsType, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import { AppContext } from '../contexts/AppContextProvider'
import useSnackbar from '../hooks/useSnackbar'
import useTtsPlayer from '../hooks/useTtsPlayer'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import navigateToLanguageChange from '../navigation/navigateToLanguageChange'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import CustomHeaderButtons from './CustomHeaderButtons'
import HeaderBox from './HeaderBox'
import HighlightBox from './HighlightBox'

const Horizontal = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const BoxShadow = styled(HighlightBox)`
  height: ${dimensions.headerHeight}px;
`

enum HeaderButtonTitle {
  Disclaimer = 'disclaimer',
  Language = 'changeLanguage',
  Location = 'changeLocation',
  Search = 'search',
  ReadAloud = 'readAloud',
  Share = 'share',
  Settings = 'settings',
  Feedback = 'feedback',
}

type HeaderProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
  showItems?: boolean
  showOverflowItems?: boolean
  languages?: LanguageModel[]
  availableLanguages?: string[]
  shareUrl?: string
  cityName?: string
}

const Header = ({
  navigation,
  route,
  availableLanguages,
  shareUrl,
  showItems = false,
  showOverflowItems = true,
  languages,
  cityName,
}: HeaderProps): ReactElement | null => {
  const { languageCode, cityCode } = useContext(AppContext)
  const { t } = useTranslation('layout')
  const theme = useTheme()
  const showSnackbar = useSnackbar()
  // Save route/canGoBack to state to prevent it from changing during navigating which would lead to flickering of the title and back button
  const [previousRoute] = useState(navigation.getState().routes[navigation.getState().routes.length - 2])
  const canGoBack = previousRoute !== undefined
  const { enabled: isTtsEnabled, showTtsPlayer } = useTtsPlayer()

  const onShare = async () => {
    if (!shareUrl) {
      // The share option should only be shown if there is a shareUrl
      return
    }
    const pageTitle = (route.params as { title: string } | undefined)?.title ?? t(route.name)
    const cityPostfix = !cityName || cityName === pageTitle ? '' : ` - ${cityName}`

    const message = t('shareMessage', {
      message: `${pageTitle}${cityPostfix} ${shareUrl}`,
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
      color={visible ? theme.legacy.colors.textColor : 'transparent'}
      accessibilityLabel={t(title)}
    />
  )

  const renderOverflowItem = (title: string, onPress: () => void): ReactElement => (
    <HiddenItem
      key={title}
      title={t(title)}
      onPress={onPress}
      style={{
        backgroundColor: theme.legacy.colors.backgroundColor,
      }}
      titleStyle={{ color: theme.legacy.colors.textColor }}
    />
  )

  const goToLanguageChange = () => {
    if (availableLanguages?.length === 1 && availableLanguages[0] === languageCode) {
      showSnackbar({ text: 'layout:noTranslation' })
    } else if (languages && availableLanguages) {
      navigateToLanguageChange({ navigation, availableLanguages, languages })
    }
  }

  const getCategorySlug = (path?: string): string | undefined => {
    if (!path) {
      return undefined
    }
    return getSlugFromPath(path)
  }

  const getSlugForRoute = (): string | undefined => {
    switch (route.name) {
      case EVENTS_ROUTE:
        return (route.params as RoutesParamsType[EventsRouteType]).slug

      case POIS_ROUTE:
        return (route.params as RoutesParamsType[PoisRouteType]).slug

      case CATEGORIES_ROUTE:
        return getCategorySlug((route.params as RoutesParamsType[CategoriesRouteType]).path)

      case DISCLAIMER_ROUTE:
        return DISCLAIMER_ROUTE

      default:
        return undefined
    }
  }

  const navigateToFeedback = () => {
    if (cityCode) {
      createNavigateToFeedbackModal(navigation)({
        routeType: route.name as FeedbackRouteType,
        language: languageCode,
        cityCode,
        slug: getSlugForRoute(),
      })
    }
  }

  const items = [
    renderItem(HeaderButtonTitle.Search, 'search', showItems, () =>
      navigation.navigate(SEARCH_ROUTE, {
        searchText: null,
      }),
    ),
    renderItem(HeaderButtonTitle.Language, 'language', showItems, goToLanguageChange),
  ]

  const overflowItems = showOverflowItems
    ? [
        ...(shareUrl ? [renderOverflowItem(HeaderButtonTitle.Share, onShare)] : []),
        ...(!buildConfig().featureFlags.fixedCity
          ? [renderOverflowItem(HeaderButtonTitle.Location, () => navigation.navigate(LANDING_ROUTE))]
          : []),
        renderOverflowItem(HeaderButtonTitle.Settings, () => navigation.navigate(SETTINGS_ROUTE)),
        ...(isTtsEnabled ? [renderOverflowItem(t(HeaderButtonTitle.ReadAloud), showTtsPlayer)] : []),
        ...(route.name !== NEWS_ROUTE ? [renderOverflowItem(HeaderButtonTitle.Feedback, navigateToFeedback)] : []),
        ...(route.name !== DISCLAIMER_ROUTE
          ? [renderOverflowItem(HeaderButtonTitle.Disclaimer, () => navigation.navigate(DISCLAIMER_ROUTE))]
          : []),
      ]
    : []

  const getHeaderText = (): { text: string; language?: string } => {
    const currentTitle = (route.params as { title?: string } | undefined)?.title
    if (!previousRoute) {
      // Home/Dashboard: Show current route title, i.e. city name
      return { text: currentTitle ?? '', language: config.sourceLanguage }
    }

    const poisRouteParams = route.params as RoutesParamsType[PoisRouteType] | undefined
    const isSinglePoi = !!poisRouteParams?.slug || poisRouteParams?.multipoi !== undefined
    const notFromDeepLink = previousRoute.name === POIS_ROUTE
    if (isSinglePoi && notFromDeepLink) {
      return { text: t('locations'), language: undefined } // system language
    }

    const previousRouteTitle = (previousRoute.params as { title?: string } | undefined)?.title

    if (previousRouteTitle) {
      return { text: previousRouteTitle, language: languageCode }
    }

    if (previousRoute.name === CATEGORIES_ROUTE) {
      return {
        text: t('localInformation'),
        language: languageCode,
      }
    }

    return { text: t(previousRoute.name), language: undefined } // system language
  }

  return (
    <BoxShadow>
      <Horizontal>
        <HeaderBox
          goBack={navigation.goBack}
          canGoBack={canGoBack}
          text={getHeaderText().text}
          language={getHeaderText().language}
        />
        <CustomHeaderButtons cancelLabel={t('cancel')} items={items} overflowItems={overflowItems} />
      </Horizontal>
    </BoxShadow>
  )
}

export default Header
