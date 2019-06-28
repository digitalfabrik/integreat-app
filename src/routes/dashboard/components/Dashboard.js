// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { RefreshControl, ScrollView } from 'react-native'
import Categories from '../../../modules/categories/components/Categories'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { CityModel } from '@integreat-app/integreat-api-client'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import NavigationTiles from '../../../modules/common/components/NavigationTiles'
import TileModel from '../../../modules/common/models/TileModel'
import eventsIcon from '../assets/events.svg'
import offersIcon from '../assets/offers.svg'
import localInformationIcon from '../assets/local_information.svg'
import type { TFunction } from 'react-i18next'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'
import type { NavigateToIntegreatUrlParamsType } from '../../../modules/app/createNavigateToIntegreatUrl'
import type { NavigateToEventParamsType } from '../../../modules/app/createNavigateToEvent'

export type PropsType = {|
  navigation: NavigationScreenProp<*>,
  cityCode?: string,

  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void,
  navigateToDashboard: NavigateToCategoryParamsType => void,
  theme: ThemeType,

  language?: string,
  cities?: Array<CityModel>,
  stateView?: CategoriesRouteStateView,
  resourceCache?: LanguageResourceCacheStateType,
  t: TFunction
|}

class Dashboard extends React.Component<PropsType> {
  getNavigationTileModels (cityCode: string, language: string): Array<TileModel> {
    const {navigation, navigateToCategory, navigateToEvent, t} = this.props
    const navigateToExtras = () => {
      navigation.navigate('Extras', {
        cityCode,
        sharePath: `/${cityCode}/${language}/extras`
      })
    }

    return [
      new TileModel({
        title: t('localInformation'),
        path: 'categories',
        thumbnail: localInformationIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToCategory({cityCode, language, path: `/${cityCode}/${language}`}),
        notifications: 0
      }),
      new TileModel({
        title: t('offers'),
        path: 'extras',
        thumbnail: offersIcon,
        isExternalUrl: false,
        onTilePress: navigateToExtras,
        notifications: 0
      }),
      new TileModel({
        title: t('events'),
        path: 'events',
        thumbnail: eventsIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToEvent({cityCode, language}),
        notifications: 0
      })
    ]
  }

  landing = () => this.props.navigation.navigate('Landing')

  onRefresh = () => {
    const {navigateToDashboard, cityCode, language, navigation} = this.props
    if (cityCode && language) {
      navigateToDashboard({
        cityCode, language, path: `/${cityCode}/${language}`, forceUpdate: true, key: navigation.getParam('key')
      })
    }
  }

  render () {
    const {
      cities, stateView, theme, resourceCache, navigateToIntegreatUrl, language, cityCode, navigateToCategory,
      navigation
    } = this.props

    if (!stateView || !cities || !resourceCache || !cityCode || !language) {
      return <ScrollView refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing />} />
    }

    return <ScrollView refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={false} />}>
        <NavigationTiles tiles={this.getNavigationTileModels(cityCode, language)}
                         theme={theme} />
        <Categories stateView={stateView}
                    cities={cities}
                    resourceCache={resourceCache}
                    language={language}
                    cityCode={cityCode}
                    theme={theme}
                    navigation={navigation}
                    navigateToCategory={navigateToCategory}
                    navigateToIntegreatUrl={navigateToIntegreatUrl} />
    </ScrollView>
  }
}

export default Dashboard
