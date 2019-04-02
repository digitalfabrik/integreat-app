// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { ActivityIndicator, Button, ScrollView } from 'react-native'
import Categories from '../../../modules/categories/components/Categories'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { CityModel } from '@integreat-app/integreat-api-client'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { ResourceCacheStateType } from '../../../modules/app/StateType'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  cityCode: string,

  toggleTheme: () => void,
  goOffline: () => void,
  goOnline: () => void,
  fetchCities: (language: string) => void,
  navigateToCategory: (cityCode: string, language: string, path: string) => void,
  navigateToEvent: (cityCode: string, language: string, path?: string) => void,
  theme: ThemeType,

  language: string,
  cities?: Array<CityModel>,
  stateView: ?CategoriesRouteStateView,
  resourceCache?: ResourceCacheStateType
}

class Dashboard extends React.Component<PropsType> {
  static navigationOptions = {
    headerTitle: 'Dashboard'
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
    const {cities, stateView, resourceCache} = this.props

    if (!stateView || !cities || !resourceCache) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return (<ScrollView>
        <Categories stateView={stateView}
                    cities={cities} resourceCache={resourceCache}
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
