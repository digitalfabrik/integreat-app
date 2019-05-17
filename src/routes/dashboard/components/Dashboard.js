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

type PropsType = {
  navigation: NavigationScreenProp<*>,
  cityCode: string,

  toggleTheme: () => void,
  goOffline: () => void,
  goOnline: () => void,
  fetchCities: (language: string) => void,
  navigateToCategory: (cityCode: string, language: string, path: string) => void,
  navigateToEvent: (cityCode: string, language: string, path?: string) => void,
  navigateToIntegreatUrl: (url: string, cityCode: string, language: string) => void,
  navigateToDashboard: (cityCode: string, language: string, path: string, forceRefresh: boolean, key: string) => void,
  theme: ThemeType,

  language: string,
  cities?: Array<CityModel>,
  stateView: ?CategoriesRouteStateView,
  resourceCache: LanguageResourceCacheStateType,
  t: TFunction
}

class Dashboard extends React.Component<PropsType> {
  static navigationOptions = {
    headerTitle: 'Dashboard'
  }

  getNavigationTileModels (): Array<TileModel> {
    const {t, cityCode, language, navigateToCategory} = this.props
    return [
      new TileModel({
        title: t('localInformation'),
        path: 'categories',
        thumbnail: localInformationIcon,
        isExternalUrl: false,
        onTilePress: () => navigateToCategory(cityCode, language, `/${cityCode}/${language}`),
        notifications: 0
      }),
      new TileModel({
        title: t('offers'),
        path: 'extras',
        thumbnail: offersIcon,
        isExternalUrl: false,
        onTilePress: this.extras,
        notifications: 0
      }),
      new TileModel({
        title: t('events'),
        path: 'events',
        thumbnail: eventsIcon,
        isExternalUrl: false,
        onTilePress: this.events,
        notifications: 0
      })
    ]
  }

  landing = () => this.props.navigation.navigate('Landing')

  extras = () => {
    this.props.navigation.navigate('Extras', {cityCode: this.props.navigation.getParam('cityCode')})
  }

  events = () => {
    this.props.navigateToEvent(this.props.cityCode, this.props.language)
  }

  onRefresh = () => {
    const {navigateToDashboard, cityCode, language, navigation} = this.props
    navigateToDashboard(cityCode, language, `/${cityCode}/${language}`, true, navigation.getParam('key'))
  }

  render () {
    const {cities, stateView, theme, resourceCache, navigateToIntegreatUrl} = this.props

    const loading = !stateView || !cities || !resourceCache

    return <ScrollView
      refreshControl={<RefreshControl onRefresh={this.onRefresh} refreshing={loading} />}>
      {!loading && <>
        <NavigationTiles tiles={this.getNavigationTileModels()}
                         theme={theme} />
        {/* $FlowFixMe Flow doesn't recognize stateView and cities to not be nullish */}
        <Categories stateView={stateView}
                    cities={cities}
                    resourceCache={resourceCache}
                    language={this.props.language}
                    cityCode={this.props.cityCode}
                    theme={this.props.theme}
                    navigateToCategory={this.props.navigateToCategory}
                    navigateToIntegreatUrl={navigateToIntegreatUrl} />
      </>}
    </ScrollView>
  }
}

export default Dashboard
