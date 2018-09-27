// @flow

import * as React from 'react'
import { Button } from 'react-native-elements'
import type { NavigationScreenProp } from 'react-navigation'
import Caption from '../../../modules/common/components/Caption'
import CityModel from '../../../modules/endpoint/models/CityModel'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import { ActivityIndicator } from 'react-native'
import type { FilesStateType } from '../../../modules/app/StateType'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  cityModel: CityModel,

  toggleTheme: () => void,
  goOffline: () => void,
  goOnline: () => void,
  fetchCategories: (prioritisedLanguage: string, city: string) => void,
  fetchCities: (language: string) => void,
  cancelFetchCategories: () => void,

  language: string,
  cities?: Array<CityModel>,
  categories?: CategoriesMapModel,
  files?: FilesStateType
}

class Dashboard extends React.Component<PropsType> {
  static navigationOptions = {
    headerTitle: 'Dashboard'
  }

  componentDidMount () {
    if (!this.props.cities) {
      this.props.fetchCities(this.props.language)
    }

    if (!this.props.categories) {
      this.props.fetchCategories(this.props.language, this.props.cityModel.code)

      // Cancels the fetch if you navigate away
      const didBlurSubscription = this.props.navigation.addListener('didBlur', () => {
        this.props.cancelFetchCategories()
        didBlurSubscription.remove()
      })
    }
  }

  categories = () => this.props.navigation.navigate('Categories', {city: this.props.cityModel.code})

  landing = () => this.props.navigation.navigate('Landing')

  goMaps = () => this.props.navigation.navigate('MapViewModal')

  render () {
    const categories = this.props.categories
    const cities = this.props.cities

    if (!categories || !cities || !this.props.files) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return (<React.Fragment>
        <Caption title={this.props.cityModel.name} />
        <Button
          title='Go to Categories'
          onPress={this.categories}
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
      </React.Fragment>
    )
  }
}

export default Dashboard
