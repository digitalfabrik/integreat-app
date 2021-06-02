import * as React from 'react'
import Categories from '../../../components/Categories'
import { ThemeType } from 'build-configs/ThemeType'
import { CityModel } from 'api-client'
import CategoriesRouteStateView from '../../../models/CategoriesRouteStateView'
import { LanguageResourceCacheStateType } from '../../../redux/StateType'
import NavigationTiles from '../../../components/NavigationTiles'
import TileModel from '../../../models/TileModel'
import eventsIcon from '../assets/events.svg'
import offersIcon from '../assets/offers.svg'
import poisIcon from '../assets/pois.svg'
import newsIcon from '../assets/news.svg'
import localInformationIcon from '../assets/local_information.svg'
import { TFunction } from 'react-i18next'
import buildConfig from '../../../constants/buildConfig'
import SpaceBetween from '../../../components/SpaceBetween'
import styled from 'styled-components/native'
import { cityContentPath } from '../../../navigation/url'
import { FeedbackInformationType } from '../../../components/FeedbackContainer'
import {
  CATEGORIES_ROUTE,
  EVENTS_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  TU_NEWS_TYPE
} from 'api-client/src/routes'
import { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'
import testID from '../../../testing/testID'

const Spacing = styled.View`
  padding: 10px;
`
export type PropsType = {
  navigateTo: (arg0: RouteInformationType) => void
  navigateToLink: (url: string, language: string, shareUrl: string) => void
  navigateToFeedback: (arg0: FeedbackInformationType) => void
  theme: ThemeType
  language: string
  cityModel: CityModel
  stateView: CategoriesRouteStateView
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  t: TFunction
}

class Dashboard extends React.Component<PropsType> {
  getNavigationTileModels(): Array<TileModel> {
    const { navigateTo, cityModel, language, t } = this.props
    const { featureFlags } = buildConfig()
    const { tunewsEnabled, pushNotificationsEnabled, code: cityCode } = cityModel
    const isNewsEnabled = tunewsEnabled || pushNotificationsEnabled
    const tiles = [
      new TileModel({
        title: t('localInformation'),
        path: 'categories',
        thumbnail: localInformationIcon,
        isExternalUrl: false,
        onTilePress: () =>
          navigateTo({
            route: CATEGORIES_ROUTE,
            cityCode,
            languageCode: language,
            cityContentPath: cityContentPath({
              cityCode,
              languageCode: language
            })
          }),
        notifications: 0
      })
    ]

    if (featureFlags.newsStream && isNewsEnabled) {
      tiles.push(
        new TileModel({
          title: t('news'),
          path: 'news',
          thumbnail: newsIcon,
          isExternalUrl: false,
          onTilePress: () =>
            navigateTo({
              route: NEWS_ROUTE,
              cityCode,
              languageCode: language,
              newsType: pushNotificationsEnabled ? LOCAL_NEWS_TYPE : TU_NEWS_TYPE
            }),
          notifications: 0
        })
      )
    }

    if (cityModel.eventsEnabled) {
      tiles.push(
        new TileModel({
          title: t('events'),
          path: 'events',
          thumbnail: eventsIcon,
          isExternalUrl: false,
          onTilePress: () =>
            navigateTo({
              route: EVENTS_ROUTE,
              cityCode,
              languageCode: language
            }),
          notifications: 0
        })
      )
    }

    if (cityModel.offersEnabled) {
      tiles.push(
        new TileModel({
          title: t('offers'),
          path: 'offers',
          thumbnail: offersIcon,
          isExternalUrl: false,
          onTilePress: () =>
            navigateTo({
              route: OFFERS_ROUTE,
              cityCode,
              languageCode: language
            }),
          notifications: 0
        })
      )
    }

    if (cityModel.poisEnabled && featureFlags.pois) {
      tiles.push(
        new TileModel({
          title: t('pois'),
          path: 'pois',
          thumbnail: poisIcon,
          isExternalUrl: false,
          onTilePress: () =>
            navigateTo({
              route: POIS_ROUTE,
              cityCode,
              languageCode: language
            }),
          notifications: 0
        })
      )
    }

    return tiles
  }

  render() {
    const {
      stateView,
      theme,
      resourceCache,
      resourceCacheUrl,
      language,
      cityModel,
      navigateTo,
      navigateToLink,
      navigateToFeedback
    } = this.props
    const navigationTiles = this.getNavigationTileModels()
    return (
      <SpaceBetween {...testID('Dashboard-Page')}>
        {navigationTiles.length > 1 ? (
          <NavigationTiles tiles={navigationTiles} theme={theme} language={language} />
        ) : (
          <Spacing />
        )}
        <Categories
          stateView={stateView}
          resourceCache={resourceCache}
          resourceCacheUrl={resourceCacheUrl}
          language={language}
          cityModel={cityModel}
          theme={theme}
          navigateTo={navigateTo}
          navigateToFeedback={navigateToFeedback}
          navigateToLink={navigateToLink}
        />
      </SpaceBetween>
    )
  }
}

export default Dashboard
