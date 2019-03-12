// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { ActivityIndicator, ScrollView, Button } from 'react-native'
import type { FilesStateType } from '../../../modules/app/StateType'
import Categories from '../../../modules/categories/components/Categories'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { CategoriesMapModel, CityModel } from '@integreat-app/integreat-api-client'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  cityModel: CityModel,
  path: string,

  toggleTheme: () => void,
  goOffline: () => void,
  goOnline: () => void,
  fetchCategories: (prioritisedLanguage: string, city: string) => void,
  fetchCities: (language: string) => void,
  cancelFetchCategories: () => void,
  navigateToCategories: (path: string) => void,
  theme: ThemeType,

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

  navigateCategories = () => this.props.navigation.navigate('Categories', {city: this.props.cityModel.code})

  landing = () => this.props.navigation.navigate('Landing')

  extras = () => {
    this.props.navigation.navigate('Extras', {cityModel: this.props.navigation.getParam('cityModel')})
  }

  events = () => {
    this.props.navigation.navigate('Events', {cityModel: this.props.navigation.getParam('cityModel')})
  }

  goMaps = () => this.props.navigation.navigate('MapViewModal')

  render () {
    const categories = this.props.categories
    const cities = this.props.cities

    if (!categories || !cities || !this.props.files) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return (<ScrollView>
        <Categories categories={categories} cities={cities} files={this.props.files}
                    language={this.props.language}
                    city={this.props.cityModel.code}
                    path={this.props.path}
                    navigateToCategories={this.props.navigateToCategories} theme={this.props.theme} />
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
