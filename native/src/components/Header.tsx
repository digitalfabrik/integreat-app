import { NavigationRoute, ParamListBase } from '@react-navigation/native'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import {
  CATEGORIES_ROUTE,
  CategoriesRouteType,
  EVENTS_ROUTE,
  EventsRouteType,
  FEEDBACK_MODAL_ROUTE,
  getSlugFromPath,
  IMPRINT_ROUTE,
  LANGUAGES_ROUTE,
  NEWS_ROUTE,
  PLACES_ROUTE,
  PlacesRouteType,
  REGIONS_ROUTE,
  SEARCH_ROUTE,
} from 'shared'
import { FeedbackRouteType, LanguageModel } from 'shared/api'

import { ROOT_NAVIGATOR_ID, TAB_NAVIGATOR_ID } from '../constants'
import { NavigationProps, RouteProps, RoutesParamsType, RoutesType } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import { AppContext } from '../contexts/AppContext'
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

const getRouteTitle = (route: Partial<NavigationRoute<ParamListBase, string>>): string | undefined => {
  const { state, params } = route
  const focusedRoute = state?.routes[state.index ?? state.routes.length - 1]
  const nestedTitle = focusedRoute ? getRouteTitle(focusedRoute) : undefined
  return nestedTitle ?? (params as { title?: string } | undefined)?.title
}

type HeaderProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
  showItems?: boolean
  languages?: LanguageModel[]
  availableLanguages?: string[]
  shareUrl?: string
  regionName?: string
  forceText?: boolean
  goBack?: () => void
  menu?: ReactElement | null
}

const Header = ({
  navigation,
  route,
  availableLanguages = route.name === REGIONS_ROUTE ? supportedLanguages.map(it => it.code) : undefined,
  shareUrl,
  showItems = false,
  languages = route.name === REGIONS_ROUTE ? supportedLanguages : undefined,
  regionName,
  forceText = route.name === REGIONS_ROUTE,
  goBack,
  menu,
}: HeaderProps): ReactElement | null => {
  const [menuVisible, setMenuVisible] = useState(false)
  const { languageCode, regionCode } = useContext(AppContext)
  const { t } = useTranslation()
  const showSnackbar = useSnackbar()
  // Save route/canGoBack to state to prevent it from changing during navigating which would lead to flickering of the title and back button
  const [previousRouteKey] = useState(() => {
    const { routes } = navigation.getState()
    return routes[routes.findIndex(navRoute => navRoute.key === route.key) - 1]?.key
  })
  const { showTtsPlayer } = useTtsPlayer()

  const previousRoute = navigation.getState().routes.find(route => route.key === previousRouteKey)
  const headerTitle = previousRoute ? getRouteTitle(previousRoute) : (regionName ?? '')

  const isRegions = route.name === REGIONS_ROUTE
  const currentLanguageName = languages?.find(it => it.code === languageCode)?.name

  const placesParams = route.params as RoutesParamsType[PlacesRouteType] | undefined
  const hasPlacesParams = !!placesParams?.slug || placesParams?.multiPlace !== undefined

  const tabNavigationState = navigation.getParent(TAB_NAVIGATOR_ID)?.getState()
  const rootNavigationState = navigation.getParent(ROOT_NAVIGATOR_ID)?.getState()

  const hasTabHistory = !!tabNavigationState && tabNavigationState.index > 0
  const hasRootHistory = !!rootNavigationState && rootNavigationState.index > 0

  const canGoBack =
    previousRoute !== undefined || hasRootHistory || hasTabHistory || (route.name === PLACES_ROUTE && hasPlacesParams)

  const routeTitle = (route.params as { title?: string } | undefined)?.title
  const pageTitle = routeTitle && routeTitle !== regionName ? `${routeTitle} - ${regionName}` : regionName

  const getCategorySlug = (path?: string): string | undefined => (path ? getSlugFromPath(path) : undefined)

  const getSlugForRoute = (): string | undefined => {
    switch (route.name) {
      case EVENTS_ROUTE:
        return (route.params as RoutesParamsType[EventsRouteType]).slug
      case PLACES_ROUTE:
        return (route.params as RoutesParamsType[PlacesRouteType]).slug
      case CATEGORIES_ROUTE:
        return getCategorySlug((route.params as RoutesParamsType[CategoriesRouteType]).path)
      case IMPRINT_ROUTE:
        return IMPRINT_ROUTE
      default:
        return undefined
    }
  }

  const goToLanguageChange = () => {
    if (availableLanguages?.length === 1 && availableLanguages[0] === languageCode) {
      showSnackbar({ text: t($ => $.languages.error.noTranslation) })
    } else if (languages && availableLanguages) {
      navigation.navigate(LANGUAGES_ROUTE, {
        languages,
        availableLanguages,
        routeType: route.name as FeedbackRouteType,
        slug: getSlugForRoute(),
      })
    }
  }

  const navigateToFeedback = () => {
    if (regionCode) {
      navigation.navigate(FEEDBACK_MODAL_ROUTE, {
        routeType: route.name as FeedbackRouteType,
        language: languageCode,
        regionCode,
        slug: getSlugForRoute(),
      })
    }
  }

  const items = [
    <HeaderActionItem
      key='search'
      accessibilityLabel={t($ => $.search.title)}
      iconName='search'
      visible={showItems}
      onPress={() => navigation.navigate(SEARCH_ROUTE, { searchText: null })}
    />,
    <HeaderActionItem
      key='language'
      accessibilityLabel={t($ => $.languages.change)}
      iconName='language'
      visible={showItems || isRegions}
      onPress={goToLanguageChange}
      innerText={forceText ? currentLanguageName : undefined}
    />,
  ]

  const menuItems = [
    ...(route.name !== NEWS_ROUTE && regionCode
      ? [
          <HeaderMenuItem
            key='feedback'
            title={t($ => $.feedback.title)}
            onPress={navigateToFeedback}
            closeMenu={() => setMenuVisible(false)}
            icon='comment-text-outline'
          />,
        ]
      : []),
    <HeaderMenuItem
      key='tts'
      title={t($ => $.tts.title)}
      onPress={showTtsPlayer}
      closeMenu={() => setMenuVisible(false)}
      icon='volume-high'
    />,
  ]

  const defaultMenu = (
    <HeaderMenu
      navigation={navigation}
      visible={menuVisible}
      setVisible={setMenuVisible}
      menuItems={menuItems}
      shareUrl={shareUrl}
      pageTitle={pageTitle}
    />
  )

  const regionsPath =
    !previousRoute && !hasRootHistory && !isRegions ? () => navigation.navigate(REGIONS_ROUTE) : undefined

  return (
    <BoxShadow>
      <Horizontal>
        <HeaderBox
          goBack={goBack ?? navigation.goBack}
          canGoBack={canGoBack}
          title={headerTitle}
          language={languageCode}
          regionsPath={regionsPath}
        />
        <ActionButtons items={items} />
        {/* Passing null should hide the menu, so don't simplify this to menu ?? defaultMenu */}
        {menu !== undefined ? menu : defaultMenu}
      </Horizontal>
    </BoxShadow>
  )
}

export default Header
