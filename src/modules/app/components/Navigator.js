// @flow

import * as React from 'react'
import type { NavigationContainer } from 'react-navigation'
import { generateKey } from '../generateRouteKey'
import AppSettings from '../../settings/AppSettings'
import createAppNavigationContainer from '../createAppNavigationContainer'
import { Text } from 'react-native'

type PropsType = {|
  fetchCategory: (cityCode: string, language: string, key: string) => void,
  clearCategory: (key: string) => void,
  fetchCities: (forceRefresh: boolean) => void
|}

type StateType = {| waitingForSettings: boolean, errorMessage: null |}

class Navigator extends React.Component<PropsType, StateType> {
  appNavigationContainer: ?NavigationContainer<*, *, *>
  state = { waitingForSettings: true, errorMessage: null }

  componentDidMount () {
    const { fetchCities } = this.props
    fetchCities(false)
    this.initializeAppContainer().catch(error => this.setState({ errorMessage: error.message }))
  }

  async initializeAppContainer () {
    const { fetchCategory, clearCategory } = this.props
    const appSettings = new AppSettings()
    const [cityCode, language] = await Promise.all([appSettings.loadSelectedCity(), appSettings.loadContentLanguage()])
    if (!language) {
      throw Error('The contentLanguage has not been set correctly by I18nProvider!')
    }
    if (cityCode) {
      const key = generateKey()
      this.appNavigationContainer = createAppNavigationContainer({
        initialRouteName: 'CityContent', cityCode, language, clearCategory, key
      })
      fetchCategory(cityCode, language, key)
    } else {
      this.appNavigationContainer = createAppNavigationContainer({ initialRouteName: 'Landing' })
    }

    this.setState({ waitingForSettings: false })
  }

  render () {
    if (this.state.errorMessage) {
      return <Text>{this.state.errorMessage}</Text>
    }
    const AppContainer = this.appNavigationContainer
    return AppContainer ? <AppContainer /> : null
  }
}

export default Navigator
