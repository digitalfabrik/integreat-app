import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Menu } from 'react-native-paper'
import { Item } from 'react-navigation-header-buttons'
import styled, { useTheme } from 'styled-components/native'

import { ThemeKey } from 'build-configs/ThemeKey'
import {
  CATEGORIES_ROUTE,
  CategoriesRouteType,
  EVENTS_ROUTE,
  EventsRouteType,
  getSlugFromPath,
  NEWS_ROUTE,
  POIS_ROUTE,
  PoisRouteType,
  DISCLAIMER_ROUTE,
  LICENSES_ROUTE,
  SEARCH_ROUTE,
  SETTINGS_ROUTE,
  BOTTOM_TAB_NAVIGATION_ROUTE,
} from 'shared'
import { LanguageModel, FeedbackRouteType } from 'shared/api'
import { config } from 'translations'

import { NavigationProps, RouteProps, RoutesParamsType, RoutesType } from '../constants/NavigationTypes'
import { contentAlignmentRTLText } from '../constants/contentDirection'
import dimensions from '../constants/dimensions'
import { AppContext } from '../contexts/AppContextProvider'
import useSnackbar from '../hooks/useSnackbar'
import useTtsPlayer from '../hooks/useTtsPlayer'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import navigateToLanguageChange from '../navigation/navigateToLanguageChange'
import CustomHeaderButtons from './CustomHeaderButtons'
import HeaderBox from './HeaderBox'
import HeaderMenu from './HeaderMenu'
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

const IconPlaceholder = () => <View style={{ width: 40 }} />

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
  const [visible, setVisible] = useState(false)
  const { languageCode, cityCode, settings, updateSettings } = useContext(AppContext)
  const { t } = useTranslation('layout')
  const theme = useTheme()
  const showSnackbar = useSnackbar()
  // Save route/canGoBack to state to prevent it from changing during navigating which would lead to flickering of the title and back button
  const [previousRoute] = useState(navigation.getState().routes[navigation.getState().routes.length - 2])
  const { enabled: isTtsEnabled, showTtsPlayer } = useTtsPlayer()

  const poisParams = route.params as RoutesParamsType[PoisRouteType] | undefined
  const hasPoisParams = !!poisParams?.slug || poisParams?.multipoi !== undefined

  const canGoBack = previousRoute !== undefined || (route.name === POIS_ROUTE && hasPoisParams)

  const goBack = () => {
    if (route.name === POIS_ROUTE && hasPoisParams) {
      navigation.setParams({ slug: undefined, multipoi: undefined })
    } else {
      navigation.goBack()
    }
  }

  // processing pageTitle for sharing
  const routeTitle = (route.params as { title?: string } | undefined)?.title
  const titleWithoutCity = routeTitle ?? t(route.name)
  const shouldAppendCityName = !!cityName && cityName !== titleWithoutCity
  const pageTitle = shouldAppendCityName ? `${titleWithoutCity} - ${cityName}` : titleWithoutCity

  const closeMenu = () => setVisible(false)

  const renderItem = (title: string, iconName: string, visible: boolean, onPress?: () => void): ReactElement => (
    <Item
      key={title}
      disabled={!visible}
      title={t(title)}
      iconName={iconName}
      onPress={visible ? onPress : () => undefined}
      color={visible ? theme.colors.onSurface : 'transparent'}
      accessibilityLabel={t(title)}
    />
  )

  const renderMenuItem = (title: string, onPress: () => void, icon?: string): ReactElement => (
    <Menu.Item
      leadingIcon={icon ?? IconPlaceholder}
      key={title}
      title={t(title)}
      onPress={() => {
        onPress()
        closeMenu()
      }}
      style={{
        backgroundColor: theme.dark ? theme.colors.surfaceVariant : theme.colors.surface,
      }}
      contentStyle={{ flex: 1 }}
      titleStyle={{ color: theme.colors.onSurface, textAlign: contentAlignmentRTLText(t(title)), paddingRight: 8 }}
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

  const toggleContrastTheme = () => {
    const newTheme: ThemeKey = settings.selectedTheme === 'light' ? 'contrast' : 'light'
    updateSettings({ selectedTheme: newTheme })
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
        ...(route.name !== NEWS_ROUTE
          ? [renderMenuItem(HeaderButtonTitle.Feedback, navigateToFeedback, 'comment-text-outline')]
          : []),
        renderMenuItem('contrastTheme', toggleContrastTheme, 'contrast-circle'),
        renderMenuItem(HeaderButtonTitle.Settings, () => navigation.navigate(SETTINGS_ROUTE), 'cog-outline'),
        ...(isTtsEnabled ? [renderMenuItem(t(HeaderButtonTitle.ReadAloud), showTtsPlayer, 'volume-high')] : []),
      ]
    : []

  const getHeaderText = (): { text: string; language?: string } => {
    if (!previousRoute) {
      // Home/Dashboard: Show current city name
      return { text: cityName ?? '', language: config.sourceLanguage }
    }

    const poisRouteParams = route.params as RoutesParamsType[PoisRouteType] | undefined
    const isSinglePoi = !!poisRouteParams?.slug || poisRouteParams?.multipoi !== undefined
    const notFromDeepLink = previousRoute.name === POIS_ROUTE
    if (isSinglePoi && notFromDeepLink) {
      return { text: t('locations'), language: undefined } // system language
    }

    const eventsRouteParams = route.params as RoutesParamsType[EventsRouteType] | undefined
    const isSingleEvent = !!eventsRouteParams?.slug
    const notFromEventsDeepLink = previousRoute.name === EVENTS_ROUTE
    if (isSingleEvent && notFromEventsDeepLink) {
      return { text: t('events'), language: undefined } // system language
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
          goBack={goBack}
          canGoBack={canGoBack}
          text={getHeaderText().text}
          language={getHeaderText().language}
        />
        <>
          <CustomHeaderButtons items={items} />
          <HeaderMenu
            visible={visible}
            setVisible={setVisible}
            menuItems={overflowItems}
            shareUrl={shareUrl}
            pageTitle={pageTitle}
            onNavigateToDisclaimer={() => navigation.navigate(DISCLAIMER_ROUTE)}
            onNavigateToLicenses={() => navigation.navigate(LICENSES_ROUTE)}
            renderMenuItem={renderMenuItem}
          />
        </>
      </Horizontal>
    </BoxShadow>
  )
}

export default Header
