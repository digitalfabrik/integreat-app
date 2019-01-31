// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { ActivityIndicator, ScrollView, Button } from 'react-native'
import type { FilesStateType } from '../../../modules/app/StateType'
import Categories from '../../../modules/categories/components/Categories'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { CityModel } from '@integreat-app/integreat-api-client'
import CategoriesSelectionStateView from '../../../modules/app/CategoriesSelectionStateView'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  cityCode: string,

  toggleTheme: () => void,
  goOffline: () => void,
  goOnline: () => void,
  fetchCities: (language: string) => void,
  navigateToCategory: (cityCode: string, language: string, path: string) => void,
  navigateAway: () => void,
  theme: ThemeType,

  language: string,
  cities?: Array<CityModel>,
  categoriesStateView: ?CategoriesSelectionStateView,
  files?: FilesStateType
}

class Dashboard extends React.Component<PropsType> {
  static navigationOptions = {
    headerTitle: 'Dashboard'
  }

  landing = () => this.props.navigation.navigate('Landing')

  extras = () => {
    this.props.navigation.navigate('Extras', {cityModel: this.props.navigation.getParam('cityModel')})
  }

  goMaps = () => this.props.navigation.navigate('MapViewModal')

  render () {
    const {cities, categoriesStateView} = this.props

    if (!categoriesStateView || !cities || !this.props.files) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return (<ScrollView>
        <Categories categoriesStateView={categoriesStateView}
                    cities={cities} files={this.props.files}
                    language={this.props.language}
                    cityCode={this.props.cityCode}
                    navigateToCategory={this.props.navigateToCategory} theme={this.props.theme}
                    navigateAway={this.props.navigateAway} />
        <Button
          title='Extras'
          onPress={this.extras}
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
