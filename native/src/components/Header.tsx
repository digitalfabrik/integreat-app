import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import {
  CATEGORIES_ROUTE,
  CategoriesRouteType,
  EVENTS_ROUTE,
  EventsRouteType,
  FEEDBACK_ROUTE,
  getSlugFromPath,
  IMPRINT_ROUTE,
  LANGUAGES_ROUTE,
  NEWS_ROUTE,
  PLACES_ROUTE,
  PlacesRouteType,
  REGIONS_ROUTE,
  SEARCH_ROUTE,
} from 'shared'
import { FeedbackType, LanguageModel } from 'shared/api'

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
  const { showTtsPlayer } = useTtsPlayer()

  const currentLanguageName = languages?.find(it => it.code === languageCode)?.name

  const routeTitle = (route.params as { title?: string } | undefined)?.title
  const pageTitle =
    routeTitle && regionName && routeTitle !== regionName ? `${routeTitle} - ${regionName}` : (routeTitle ?? regionName)

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
        routeType: route.name as FeedbackType,
        slug: getSlugForRoute(),
      })
    }
  }

  const navigateToFeedback = () => {
    if (regionCode) {
      navigation.navigate(FEEDBACK_ROUTE, {
        routeType: route.name as FeedbackType,
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
      visible={showItems || route.name === REGIONS_ROUTE}
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

  return (
    <BoxShadow>
      <Horizontal>
        <HeaderBox route={route} navigation={navigation} goBack={goBack} regionName={regionName} />
        <ActionButtons items={items} />
        {/* Passing null should hide the menu, so don't simplify this to menu ?? defaultMenu */}
        {menu !== undefined ? menu : defaultMenu}
      </Horizontal>
    </BoxShadow>
  )
}

export default Header
