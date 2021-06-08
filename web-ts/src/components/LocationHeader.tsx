import React, { ReactNode, ReactElement } from 'react'
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
  SPRUNGBRETT_OFFER_ROUTE,
  TU_NEWS_TYPE
} from 'api-client'
import offersIcon from '../assets/offers.svg'
import localInformationIcon from '../assets/local_information.svg'
import eventsIcon from '../assets/events.svg'
import newsIcon from '../assets/news.svg'
import poisIcon from '../assets/pois.svg'
import HeaderActionBarItemLink from '../components/HeaderActionItemLink'
import buildConfig from '../constants/buildConfig'
import { createPath, RouteType } from '../routes'

type PropsType = {
  cityModel: CityModel
  pathname: string
  route: RouteType
  languageCode: string
  viewportSmall: boolean
  onStickyTopChanged: (stickyTop: number) => void
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
}

const LocationHeader = (props: PropsType): ReactElement => {
  const { viewportSmall, onStickyTopChanged, cityModel, languageCode, pathname, languageChangePaths, route } = props
  const { eventsEnabled, poisEnabled, offersEnabled, tunewsEnabled, pushNotificationsEnabled } = cityModel

  const params = { cityCode: cityModel.code, languageCode }
  const categoriesPath = createPath(CATEGORIES_ROUTE, params)
  const eventsPath = createPath(EVENTS_ROUTE, params)
  const offersPath = createPath(OFFERS_ROUTE, params)
  const poisPath = createPath(POIS_ROUTE, params)
  const newsPath = createPath(pushNotificationsEnabled ? LOCAL_NEWS_TYPE : TU_NEWS_TYPE, params)
  const searchPath = createPath(SEARCH_ROUTE, params)
  const landingPath = createPath(LANDING_ROUTE, { languageCode })

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
        active={route === CATEGORIES_ROUTE}
        text={t('localInformation')}
        icon={localInformationIcon}
      />
    ]

    if (isNewsVisible) {
      items.push(
        <HeaderNavigationItem
          key='news'
          active={route === LOCAL_NEWS_TYPE || route === TU_NEWS_TYPE}
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
          href={eventsPath}
          active={route === EVENTS_ROUTE}
          text={t('events')}
          icon={eventsIcon}
        />
      )
    }

    if (isPoisVisible) {
      items.push(
        <HeaderNavigationItem
          key='pois'
          href={poisPath}
          active={route === POIS_ROUTE}
          text={t('pois')}
          icon={poisIcon}
        />
      )
    }

    if (isOffersVisible) {
      items.push(
        <HeaderNavigationItem
          key='offers'
          href={offersPath}
          active={route === OFFERS_ROUTE || route === SPRUNGBRETT_OFFER_ROUTE}
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
