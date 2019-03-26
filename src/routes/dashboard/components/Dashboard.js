// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { ActivityIndicator, ScrollView, Button } from 'react-native'
import Categories from '../../../modules/categories/components/Categories'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { CityModel } from '@integreat-app/integreat-api-client'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { ResourceCacheType } from '../../../modules/endpoint/ResourceCacheType'
import NavigationTiles from '../../../modules/common/components/NavigationTiles'
import TileModel from '../../../modules/common/models/TileModel'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  cityCode: string,

  toggleTheme: () => void,
  goOffline: () => void,
  goOnline: () => void,
  fetchCities: (language: string) => void,
  navigateToCategory: (cityCode: string, language: string, path: string) => void,
  theme: ThemeType,

  language: string,
  cities?: Array<CityModel>,
  stateView: ?CategoriesRouteStateView,
  resourceCache?: ResourceCacheType
}

class Dashboard extends React.Component<PropsType> {
  static navigationOptions = {
    headerTitle: 'Dashboard'
  }

  getNavigationTileModels (): Array<TileModel> {
    return [
      new TileModel({
        id: 0,
        title: 'News',
        path: 'events',
        thumbnail: 'https://cms.integreat-app.de/wp-content/uploads/extra-thumbnails/sprungbrett.jpg',
        isExternalUrl: false,
        onTilePress: this.events,
        notifications: 3
      }),
      new TileModel({
        id: 1,
        title: 'Orte',
        path: 'pois',
        thumbnail: 'https://cms.integreat-app.de/testumgebung/wp-content/uploads/sites/154/2017/11/Erste-Schritte2-150x150.png',
        isExternalUrl: false,
        onTilePress: () => console.log('Clicked pois'),
        notifications: 10
      }),
      new TileModel({
        id: 2,
        title: 'Angebote',
        path: 'extras',
        thumbnail: 'https://cms.integreat-app.de/wp-content/uploads/extra-thumbnails/raumfrei.jpg',
        isExternalUrl: false,
        onTilePress: this.extras,
        notifications: 0
      })
    ]
  }

  landing = () => this.props.navigation.navigate('Landing')

  extras = () => {
    this.props.navigation.navigate('Extras', {cityModel: this.props.navigation.getParam('cityModel')})
  }

  events = () => {
    this.props.navigation.navigate('Events', {cityModel: this.props.navigation.getParam('cityModel')})
  }

  goMaps = () => this.props.navigation.navigate('MapViewModal')

  render () {
    const {cities, stateView, theme} = this.props

    if (!stateView || !cities || !this.props.resourceCache) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return (<ScrollView>
        <NavigationTiles tiles={this.getNavigationTileModels()}
                         theme={theme} />
        <Categories stateView={stateView}
                    cities={cities} resourceCache={this.props.resourceCache}
                    language={this.props.language}
                    cityCode={this.props.cityCode}
                    navigateToCategory={this.props.navigateToCategory} theme={this.props.theme} />
        <Button
          title='Extras'
          onPress={this.extras}
        />
        <Button
          title='Events'
          onPress={this.events}
        />
        <Button
          title='Go to Landing'
          onPress={this.landing}
        />
        <Button
          title='Toggle theme'
          onPress={this.props.toggleTheme}
        />
        <Button
          title='Go Offline'
          onPress={this.props.goOffline}
        />

        <Button
          title='Go Online'
          onPress={this.props.goOnline}
        />

        <Button
          title='Go to maps'
          onPress={this.goMaps}
        />

      </ScrollView>
    )
  }
}

export default Dashboard
