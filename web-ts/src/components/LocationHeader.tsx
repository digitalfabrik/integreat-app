import React, { ReactNode } from 'react'
import { withTranslation, TFunction } from 'react-i18next'
import LanguageSelector from './LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderNavigationItem from '../components/HeaderNavigationItem'
import { CityModel } from 'api-client'
import offersIcon from '../assets/offers.svg'
import localInformationIcon from '../assets/local_information.svg'
import eventsIcon from '../assets/events.svg'
import newsIcon from '../assets/news.svg'
import poisIcon from '../assets/pois.svg'
import HeaderActionBarItemLink from '../components/HeaderActionItemLink'
import buildConfig from '../constants/buildConfig'

type PropsType = {
  cityModel: CityModel,
  pathname: string,
  languageCode: string,
  viewportSmall: boolean,
  t: TFunction,
  onStickyTopChanged: (stickyTop: number) => void,
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
}

export class LocationHeader extends React.Component<PropsType> {
  getActionItems(): Array<ReactNode> {
    const { languageCode, pathname, languageChangePaths, t } = this.props

    return [
      <HeaderActionBarItemLink
        key='search'
        // TODO Use right path
        // href={new SearchRouteConfig().getRoutePath({ city, language })}
        text={t('search')}
        iconSrc={searchIcon}
      />,
      ...(!buildConfig().featureFlags.fixedCity
        ? [
            <HeaderActionBarItemLink
              key='location'
              // TODO Use right path
              // href={new LandingRouteConfig().getRoutePath({ language })}
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

  getNavigationItems(): Array<ReactNode> {
    const { t, cityModel } = this.props
    const { eventsEnabled, poisEnabled, offersEnabled, tunewsEnabled, pushNotificationsEnabled } = cityModel

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
        // TODO Use right path and check
        // href={new CategoriesRouteConfig().getRoutePath({ city, language })}
        // active={currentRoute === CATEGORIES_ROUTE}
        href='/'
        active={false}
        text={t('localInformation')}
        icon={localInformationIcon}
      />
    ]

    if (isNewsVisible) {
      // TODO Use right path
      // const newsUrl = pushNotificationsEnabled
      //   ? new LocalNewsRouteConfig().getRoutePath({ city, language })
      //   : new TunewsRouteConfig().getRoutePath({ city, language })
      const newsUrl = '/'

      items.push(
        <HeaderNavigationItem
          key='news'
          // TODO Use right path and check
          active={false}
          // active={newsRoutes.includes(currentRoute)}
          href={newsUrl}
          text={t('news')}
          icon={newsIcon}
        />
      )
    }

    if (isEventsVisible) {
      items.push(
        <HeaderNavigationItem
          key='events'
          // TODO Use right path and check
          href='/'
          active={false}
          // href={new EventsRouteConfig().getRoutePath({ city, language })}
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
          // TODO Use right path and check
          href='/'
          active={false}
          // href={new PoisRouteConfig().getRoutePath({ city, language })}
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
          // TODO Use right path and check
          href='/'
          active={false}
          // href={new OffersRouteConfig().getRoutePath({ city, language })}
          // active={offersRoutes.includes(currentRoute)}
          text={t('offers')}
          icon={offersIcon}
        />
      )
    }

    return items
  }

  render() {
    const { cityModel } = this.props

    return (
      <Header
        viewportSmall={this.props.viewportSmall}
        // TODO Use right path
        // logoHref={new CategoriesRouteConfig().getRoutePath({ city, language })}
        logoHref='/'
        actionItems={this.getActionItems()}
        cityName={cityModel.name}
        navigationItems={this.getNavigationItems()}
        onStickyTopChanged={this.props.onStickyTopChanged}
      />
    )
  }
}

export default withTranslation('layout')(LocationHeader)
