import React, { ReactNode, ReactElement } from 'react'
import { generatePath } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderNavigationItem from '../components/HeaderNavigationItem'
import {
  CATEGORIES_ROUTE,
  CityModel,
  EVENTS_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  TU_NEWS_TYPE
} from 'api-client'
import offersIcon from '../assets/offers.svg'
import localInformationIcon from '../assets/local_information.svg'
import eventsIcon from '../assets/events.svg'
import newsIcon from '../assets/news.svg'
import poisIcon from '../assets/pois.svg'
import HeaderActionBarItemLink from '../components/HeaderActionItemLink'
import buildConfig from '../constants/buildConfig'
import { RoutePatterns } from '../routes'

type PropsType = {
  cityModel: CityModel
  pathname: string
  languageCode: string
  viewportSmall: boolean
  onStickyTopChanged: (stickyTop: number) => void
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
}

const LocationHeader = (props: PropsType): ReactElement => {
  const { viewportSmall, onStickyTopChanged, cityModel, languageCode, pathname, languageChangePaths } = props
  const { eventsEnabled, poisEnabled, offersEnabled, tunewsEnabled, pushNotificationsEnabled } = cityModel

  const params = { cityCode: cityModel.code, languageCode }
  // @ts-ignore TODO IGAPP-668 Wrong type for * parameters
  const categoriesPath = generatePath(RoutePatterns[CATEGORIES_ROUTE], params)
  const eventsPath = generatePath(RoutePatterns[EVENTS_ROUTE], params)
  const offersPath = generatePath(RoutePatterns[OFFERS_ROUTE], params)
  const poisPath = generatePath(RoutePatterns[POIS_ROUTE], params)
  const newsPath = generatePath(RoutePatterns[pushNotificationsEnabled ? LOCAL_NEWS_TYPE : TU_NEWS_TYPE], params)
  const searchPath = generatePath(RoutePatterns[SEARCH_ROUTE], params)
  const landingPath = generatePath(RoutePatterns[LANDING_ROUTE], { languageCode })

  const { t } = useTranslation('layout')

  const getActionItems = (): Array<ReactNode> => {
    return [
      <HeaderActionBarItemLink key='search' href={searchPath} text={t('search')} iconSrc={searchIcon} />,
      ...(!buildConfig().featureFlags.fixedCity
        ? [
            <HeaderActionBarItemLink
              key='location'
              href={landingPath}
              text={t('changeLocation')}
              iconSrc={landingIcon}
            />
          ]
        : []),
      <LanguageSelector
        key='language'
        languageChangePaths={languageChangePaths}
        isHeaderActionItem
        pathname={pathname}
        languageCode={languageCode}
      />
    ]
  }

  const getNavigationItems = (): Array<ReactNode> => {
    const isNewsVisible = buildConfig().featureFlags.newsStream && (pushNotificationsEnabled || tunewsEnabled)
    const isEventsVisible = eventsEnabled
    const isPoisVisible = buildConfig().featureFlags.pois && poisEnabled
    const isOffersVisible = offersEnabled

    const showNavBar = isNewsVisible || isEventsVisible || isPoisVisible || isOffersVisible
    if (!showNavBar) {
      return []
    }

    const items: Array<ReactNode> = [
      <HeaderNavigationItem
        key='categories'
        href={categoriesPath}
        // TODO IGAPP-668: Use right check
        // active={currentRoute === CATEGORIES_ROUTE}
        active={false}
        text={t('localInformation')}
        icon={localInformationIcon}
      />
    ]

    if (isNewsVisible) {
      items.push(
        <HeaderNavigationItem
          key='news'
          active={false}
          // TODO IGAPP-668: Use right check
          // active={newsRoutes.includes(currentRoute)}
          href={newsPath}
          text={t('news')}
          icon={newsIcon}
        />
      )
    }

    if (isEventsVisible) {
      items.push(
        <HeaderNavigationItem
          key='events'
          active={false}
          href={eventsPath}
          // TODO IGAPP-668: Use right check
          // active={currentRoute === EVENTS_ROUTE}
          text={t('events')}
          icon={eventsIcon}
        />
      )
    }

    if (isPoisVisible) {
      items.push(
        <HeaderNavigationItem
          key='pois'
          active={false}
          href={poisPath}
          // TODO IGAPP-668: Use right check
          // active={currentRoute === POIS_ROUTE}
          text={t('pois')}
          icon={poisIcon}
        />
      )
    }

    if (isOffersVisible) {
      items.push(
        <HeaderNavigationItem
          key='offers'
          active={false}
          href={offersPath}
          // TODO IGAPP-668: Use right check
          // active={offersRoutes.includes(currentRoute)}
          text={t('offers')}
          icon={offersIcon}
        />
      )
    }

    return items
  }

  return (
    <Header
      viewportSmall={viewportSmall}
      logoHref={categoriesPath}
      actionItems={getActionItems()}
      cityName={cityModel.name}
      navigationItems={getNavigationItems()}
      onStickyTopChanged={onStickyTopChanged}
    />
  )
}

export default LocationHeader
