// @flow

import * as React from 'react'
import type { NavigationStackProp } from 'react-navigation-stack'
import Categories from '../../../modules/categories/components/Categories'
import type { ThemeType } from '../../../modules/theme/constants'
import { CityModel } from '@integreat-app/integreat-api-client'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import NavigationTiles from '../../../modules/common/components/NavigationTiles'
import TileModel from '../../../modules/common/models/TileModel'
import eventsIcon from '../assets/events.svg'
import offersIcon from '../assets/offers.svg'
import poisIcon from '../assets/pois.svg'
import newsIcon from '../assets/news.svg'
import localInformationIcon from '../assets/local_information.svg'
import type { TFunction } from 'react-i18next'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'
import type { NavigateToInternalLinkParamsType } from '../../../modules/app/createNavigateToInternalLink'
import type { NavigateToEventParamsType } from '../../../modules/app/createNavigateToEvent'
import type { NavigateToNewsParamsType } from '../../../modules/app/createNavigateToNews'
import buildConfig from '../../../modules/app/constants/buildConfig'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import type { NavigateToPoiParamsType } from '../../../modules/app/createNavigateToPoi'
import { LOCAL_NEWS, TUNEWS } from '../../../modules/endpoint/constants'

export type PropsType = {|
  navigation: NavigationStackProp<*>,
  cityCode: string,

  navigateToPoi: NavigateToPoiParamsType => void,
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToInternalLink: NavigateToInternalLinkParamsType => void,
  navigateToDashboard: NavigateToCategoryParamsType => void,
  navigateToNews: NavigateToNewsParamsType => void,
  navigateToOffers: ({| cityCode: string, language: string |}) => void,
  theme: ThemeType,

  language: string,
  cities: Array<CityModel>,
  stateView: CategoriesRouteStateView,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string,
  t: TFunction
|}

class Dashboard extends React.Component<PropsType> {
  getNavigationTileModels (cityCode: string, language: string): Array<TileModel> {
    const {
      navigateToCategory,
      navigateToEvent,
      navigateToPoi,
      navigateToOffers,
      navigateToNews,
      cities,
      t
    } = this.props
    const { featureFlags } = buildConfig()
    const cityModel = cities.find(city => city.code === cityCode)

    if (!cityModel) {
      console.error('City model of current cityCode was not found.')
      return []
    }
    // Check if news is enabled to show the menu item
    const { tunewsEnabled, pushNotificationsEnabled } = cityModel
    const isNewsEnabled = tunewsEnabled || pushNotificationsEnabled

    const tiles = [
      new TileModel({
        title: t('localInformation'),
        path: 'categories',
        thumbnail: localInformationIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToCategory({
          cityCode,
          language,
          path: `/${cityCode}/${language}`
        }),
        notifications: 0
      })]

    if (featureFlags.newsStream && isNewsEnabled) {
      tiles.push(new TileModel({
        title: t('news'),
        path: 'news',
        thumbnail: newsIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToNews({
          cityCode,
          language,
          newsId: null,
          type: pushNotificationsEnabled ? LOCAL_NEWS : TUNEWS
        }),
        notifications: 0
      }))
    }

    if (cityModel.eventsEnabled) {
      tiles.push(new TileModel({
        title: t('events'),
        path: 'events',
        thumbnail: eventsIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToEvent({
          cityCode,
          language,
          path: null
        }),
        notifications: 0
      }))
    }

    if (cityModel.offersEnabled) {
      tiles.push(new TileModel({
        title: t('offers'),
        path: 'offers',
        thumbnail: offersIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToOffers({
          cityCode,
          language
        }),
        notifications: 0
      }))
    }

    if (featureFlags.pois) {
      tiles.push(new TileModel({
        title: t('pois'),
        path: 'pois',
        thumbnail: poisIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToPoi({
          cityCode,
          language,
          path: null
        }),
        notifications: 0
      }))
    }

    return tiles
  }

  landing = () => this.props.navigation.navigate('Landing')

  render () {
    const {
      cities,
      stateView,
      theme,
      resourceCache,
      resourceCacheUrl,
      navigateToInternalLink,
      language,
      cityCode,
      navigateToCategory,
      navigation,
      t
    } = this.props
    return (
      <SpaceBetween>
        <NavigationTiles tiles={this.getNavigationTileModels(cityCode, language)} theme={theme} language={language} />
        <Categories
          stateView={stateView}
          cities={cities}
          resourceCache={resourceCache}
          resourceCacheUrl={resourceCacheUrl}
          language={language}
          cityCode={cityCode}
          theme={theme}
          navigation={navigation}
          navigateToCategory={navigateToCategory}
          t={t}
          navigateToInternalLink={navigateToInternalLink}
        />
      </SpaceBetween>
    )
  }
}

export default Dashboard
