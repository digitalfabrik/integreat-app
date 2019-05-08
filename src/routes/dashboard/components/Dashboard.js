// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { ActivityIndicator, Button, ScrollView } from 'react-native'
import Categories from '../../../modules/categories/components/Categories'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { CityModel } from '@integreat-app/integreat-api-client'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { ResourceCacheStateType } from '../../../modules/app/StateType'
import NavigationTiles from '../../../modules/common/components/NavigationTiles'
import TileModel from '../../../modules/common/models/TileModel'
import CalendarIcon from '../assets/calendar_500x500.png'
import LocationIcon from '../assets/location_500x500.png'

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
  theme: ThemeType,

  language: string,
  cities?: Array<CityModel>,
  stateView: ?CategoriesRouteStateView,
  resourceCache: ResourceCacheStateType
}

class Dashboard extends React.Component<PropsType> {
  static navigationOptions = {
    headerTitle: 'Dashboard'
  }

  getNavigationTileModels (): Array<TileModel> {
    return [
      new TileModel({
        title: 'Veranstaltungen',
        path: 'events',
        thumbnail: CalendarIcon,
        isExternalUrl: false,
        onTilePress: this.events,
        notifications: 3
      }),
      new TileModel({
        title: 'Orte',
        path: 'pois',
        thumbnail: LocationIcon,
        isExternalUrl: false,
        onTilePress: () => console.log('Clicked pois'),
        notifications: 10
      }),
      new TileModel({
        title: 'Angebote',
        path: 'extras',
        thumbnail: 'https://cms.integreat-app.de/wp-content/uploads/extra-thumbnails/sprungbrett.jpg',
        isExternalUrl: false,
        onTilePress: this.extras,
        notifications: 2
      })
    ]
  }

  landing = () => this.props.navigation.navigate('Landing')

  extras = () => {
    this.props.navigation.navigate('Extras', {cityModel: this.props.navigation.getParam('cityModel')})
  }

  events = () => {
    this.props.navigateToEvent(this.props.cityCode, this.props.language)
  }

  goMaps = () => this.props.navigation.navigate('MapViewModal')

  render () {
    const {cities, stateView, theme, resourceCache, navigateToIntegreatUrl} = this.props

    if (!stateView || !cities || !resourceCache) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return (<ScrollView>
        <NavigationTiles tiles={this.getNavigationTileModels()}
                         theme={theme} />
        <Categories stateView={stateView}
                    cities={cities}
                    resourceCache={resourceCache}
                    language={this.props.language}
                    cityCode={this.props.cityCode}
                    theme={this.props.theme}
                    navigateToCategory={this.props.navigateToCategory}
                    navigateToIntegreatUrl={navigateToIntegreatUrl} />
      </ScrollView>
    )
  }
}

export default Dashboard
