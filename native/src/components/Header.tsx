import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import {
  BOTTOM_TAB_NAVIGATION_ROUTE,
  CATEGORIES_ROUTE,
  CategoriesRouteType,
  CHANGE_LANGUAGE_MODAL_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  EventsRouteType,
  FEEDBACK_MODAL_ROUTE,
  getSlugFromPath,
  LANDING_ROUTE,
  NEWS_ROUTE,
  POIS_ROUTE,
  PoisRouteType,
  SEARCH_ROUTE,
} from 'shared'
import { FeedbackRouteType, LanguageModel } from 'shared/api'
import { config } from 'translations'

import { ROOT_NAVIGATOR_ID, TAB_NAVIGATOR_ID } from '../constants'
import { NavigationProps, RouteProps, RoutesParamsType, RoutesType } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import { AppContext } from '../contexts/AppContextProvider'
import useSnackbar from '../hooks/useSnackbar'
import useTtsPlayer from '../hooks/useTtsPlayer'
import supportedLanguages from '../utils/supportedLanguages'
import ActionButtons from './ActionButtons'
import HeaderActionItem from './HeaderActionItem'
import HeaderBox from './HeaderBox'
import HeaderMenu from './HeaderMenu'
import HeaderMenuItem from './HeaderMenuItem'
import HighlightBox from './HighlightBox'

const Horizontal = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => (props.theme.dark ? props.theme.colors.surfaceVariant : props.theme.colors.surface)};
`

const BoxShadow = styled(HighlightBox)`
  height: ${dimensions.headerHeight}px;
`

type HeaderProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
  showItems?: boolean
  showOverflowItems?: boolean
  languages?: LanguageModel[]
  availableLanguages?: string[]
  shareUrl?: string
  cityName?: string
  forceText?: boolean
}

const Header = ({
  navigation,
  route,
  availableLanguages = route.name === LANDING_ROUTE ? supportedLanguages.map(it => it.code) : undefined,
  shareUrl,
  showItems = false,
  showOverflowItems = true,
  languages = route.name === LANDING_ROUTE ? supportedLanguages : undefined,
  cityName,
  forceText = route.name === LANDING_ROUTE,
}: HeaderProps): ReactElement | null => {
  const [visible, setVisible] = useState(false)
  const { languageCode, cityCode } = useContext(AppContext)
  const { t } = useTranslation('layout')
  const showSnackbar = useSnackbar()
  // Save route/canGoBack to state to prevent it from changing during navigating which would lead to flickering of the title and back button
  const [previousRouteKey] = useState(() => {
    const { routes } = navigation.getState()
    return routes[routes.findIndex(navRoute => navRoute.key === route.key) - 1]?.key
  })
  const previousRoute = navigation.getState().routes.find(route => route.key === previousRouteKey)
  const { showTtsPlayer } = useTtsPlayer()
  const isLanding = route.name === LANDING_ROUTE
  const currentLanguageName = languages?.find(it => it.code === languageCode)?.name

  const poisParams = route.params as RoutesParamsType[PoisRouteType] | undefined
  const hasPoisParams = !!poisParams?.slug || poisParams?.multipoi !== undefined

  const tabNavigationState = navigation.getParent(TAB_NAVIGATOR_ID)?.getState()
  const rootNavigationState = navigation.getParent(ROOT_NAVIGATOR_ID)?.getState()

  const hasTabHistory = !!tabNavigationState && tabNavigationState.index > 0
  const hasRootHistory = !!rootNavigationState && rootNavigationState.index > 0

  const canGoBack =
    previousRoute !== undefined || hasRootHistory || hasTabHistory || (route.name === POIS_ROUTE && hasPoisParams)

  const goBack = () => {
    if (route.name === POIS_ROUTE && hasPoisParams) {
      navigation.setParams({ slug: undefined, multipoi: undefined })
    } else {
      navigation.goBack()
    }
  }

  const routeTitle = (route.params as { title?: string } | undefined)?.title ?? t(route.name)
  const pageTitle = cityName !== routeTitle ? `${routeTitle} - ${cityName}` : routeTitle

  const goToLanguageChange = () => {
    if (availableLanguages?.length === 1 && availableLanguages[0] === languageCode) {
      showSnackbar({ text: 'layout:noTranslation' })
    } else if (languages && availableLanguages) {
      navigation.navigate(CHANGE_LANGUAGE_MODAL_ROUTE, {
        languages,
        availableLanguages,
      })
    }
  }

  const getCategorySlug = (path?: string): string | undefined => (path ? getSlugFromPath(path) : undefined)

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
      navigation.navigate(FEEDBACK_MODAL_ROUTE, {
        routeType: route.name as FeedbackRouteType,
        language: languageCode,
        cityCode,
        slug: getSlugForRoute(),
      })
    }
  }

  const items = [
    <HeaderActionItem
      key='search'
      title={t('search')}
      iconName='search'
      visible={showItems}
      onPress={() =>
        navigation.navigate(SEARCH_ROUTE, {
          searchText: null,
        })
      }
    />,
    <HeaderActionItem
      key='language'
      title={t('changeLanguage')}
      iconName='language'
      visible={showItems || isLanding}
      onPress={goToLanguageChange}
      innerText={forceText ? currentLanguageName : undefined}
    />,
  ]

  const overflowItems = [
    ...(route.name !== NEWS_ROUTE
      ? [
          <HeaderMenuItem
            key='feedback'
            title={t('feedback')}
            onPress={navigateToFeedback}
            icon='comment-text-outline'
          />,
        ]
      : []),
    <HeaderMenuItem key='tts' title={t('readAloud')} onPress={showTtsPlayer} icon='volume-high' />,
  ]

  const isSinglePoiFromPoisRoute = (): boolean => {
    const poisRouteParams = route.params as RoutesParamsType[PoisRouteType] | undefined
    const isSinglePoi = !!poisRouteParams?.slug || poisRouteParams?.multipoi !== undefined
    const notFromDeepLink = previousRoute?.name === POIS_ROUTE
    return isSinglePoi && notFromDeepLink
  }

  const getHeaderText = (): { text: string; language?: string } => {
    if (!previousRoute) {
      // Home/Dashboard: Show current city name
      return { text: cityName ?? '', language: config.sourceLanguage }
    }

    if (isSinglePoiFromPoisRoute()) {
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

    // After search navigation reset, previousRoute may be BOTTOM_TAB_NAVIGATION_ROUTE
    if (previousRoute.name === CATEGORIES_ROUTE || previousRoute.name === BOTTOM_TAB_NAVIGATION_ROUTE) {
      return {
        text: cityName ?? '',
        language: languageCode,
      }
    }

    return { text: t(previousRoute.name), language: undefined } // system language
  }

  const landingPath =
    !previousRoute && !hasRootHistory && !isLanding ? () => navigation.navigate(LANDING_ROUTE) : undefined

  return (
    <BoxShadow>
      <Horizontal>
        <HeaderBox
          goBack={goBack}
          canGoBack={canGoBack}
          text={getHeaderText().text}
          language={getHeaderText().language}
          landingPath={landingPath}
        />
        <ActionButtons items={items} />
        {showOverflowItems && (
          <HeaderMenu
            navigation={navigation}
            currentRoute={route.name}
            visible={visible}
            setVisible={setVisible}
            menuItems={overflowItems}
            shareUrl={shareUrl}
            pageTitle={pageTitle}
          />
        )}
      </Horizontal>
    </BoxShadow>
  )
}

export default Header
