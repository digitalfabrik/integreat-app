// @flow

import * as React from 'react'
import type { NavigationContainer } from 'react-navigation'
import { generateKey } from '../generateRouteKey'
import AppSettings from '../../settings/AppSettings'
import createAppNavigationContainer from '../createAppNavigationContainer'

type PropsType = {|
  setContentLanguage: (language: string) => void,
  clearCategory: (key: string) => void,
  fetchDashboard: ({ city: string, language: string, key: string }) => void,
  fetchCities: (forceRefresh: boolean) => void
|}

type StateType = {| waitingForSettings: boolean |}

class Navigator extends React.Component<PropsType, StateType> {
  appNavigationContainer: ?NavigationContainer<*, *, *>
  state = { waitingForSettings: true }

  async componentDidMount () {
    const { fetchCities } = this.props
    fetchCities(false)
    await this.initializeAppContainer()
  }

  async initializeAppContainer () {
    const { fetchDashboard, clearCategory } = this.props
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
      fetchDashboard({ city: cityCode, language, key })
    } else {
      this.appNavigationContainer = createAppNavigationContainer({ initialRouteName: 'Landing' })
    }

    this.setState({ waitingForSettings: false })
  }

  render () {
    const AppContainer = this.appNavigationContainer
    return AppContainer ? <AppContainer /> : null
  }
}

export default Navigator
