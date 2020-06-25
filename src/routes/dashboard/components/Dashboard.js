// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import Categories from '../../../modules/categories/components/Categories'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { CityModel } from '@integreat-app/integreat-api-client'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import NavigationTiles from '../../../modules/common/components/NavigationTiles'
import TileModel from '../../../modules/common/models/TileModel'
import eventsIcon from '../assets/events.svg'
import offersIcon from '../assets/offers.svg'
import newsIcon from '../assets/news.svg'
import localInformationIcon from '../assets/local_information.svg'
import type { TFunction } from 'react-i18next'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'
import type { NavigateToIntegreatUrlParamsType } from '../../../modules/app/createNavigateToIntegreatUrl'
import type { NavigateToEventParamsType } from '../../../modules/app/createNavigateToEvent'
import type { NavigateToNewsParamsType } from '../../../modules/app/createNavigateToNews'

import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import { LOCAL } from '../../../modules/error/hocs/withCustomNewsProvider'

export type PropsType = {|
  navigation: NavigationScreenProp<*>,
  cityCode: string,

  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void,
  navigateToDashboard: NavigateToCategoryParamsType => void,
  navigateToNews: NavigateToNewsParamsType => void,
  navigateToExtras: ({| cityCode: string, language: string |}) => void,
  theme: ThemeType,

  language: string,
  cities: Array<CityModel>,
  stateView: CategoriesRouteStateView,
  resourceCache: LanguageResourceCacheStateType,
  t: TFunction
|}

class Dashboard extends React.Component<PropsType> {
  getNavigationTileModels (cityCode: string, language: string): Array<TileModel> {
    const { navigateToCategory, navigateToEvent, navigateToExtras, t, cities, navigateToNews } = this.props
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

    if (cityModel.extrasEnabled) {
      tiles.push(new TileModel({
        title: t('offers'),
        path: 'extras',
        thumbnail: offersIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToExtras({
          cityCode,
          language
        }),
        notifications: 0
      }))
    }

    if (cityModel.extrasEnabled) {
      tiles.push(new TileModel({
        title: t('offers'),
        path: 'extras',
        thumbnail: offersIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToExtras({
          cityCode,
          language
        }),
        notifications: 0
      }))
    }

    if (cityModel.extrasEnabled) {
      tiles.push(new TileModel({
        title: t('offers'),
        path: 'extras',
        thumbnail: offersIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToExtras({
          cityCode,
          language
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

    if (isNewsEnabled) {
      tiles.push(new TileModel({
        title: t('news'),
        path: 'news',
        thumbnail: newsIcon,
        isExternalUrl: false,
        onTilePress: () =>
          navigateToNews({ cityCode, language, newsId: null, type: LOCAL })
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
      navigateToIntegreatUrl,
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
          language={language}
          cityCode={cityCode}
          theme={theme}
          navigation={navigation}
          navigateToCategory={navigateToCategory}
          t={t}
          navigateToIntegreatUrl={navigateToIntegreatUrl}
        />
      </SpaceBetween>
    )
  }
}

export default Dashboard
