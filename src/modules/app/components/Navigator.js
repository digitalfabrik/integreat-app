// @flow

import * as React from 'react'
import type { NavigationContainer } from 'react-navigation'
import { generateKey } from '../generateRouteKey'
import AppSettings from '../../settings/AppSettings'
import createNavigationContainer from '../createNavigationContainer'

type PropsType = {|
  setContentLanguage: (language: string) => void,
  clearCategory: (key: string) => void,
  fetchDashboard: ({ city: string, language: string, key: string }) => void,
  fetchCities: (forceRefresh: boolean) => void
|}

type StateType = {| waitingForSettings: boolean |}

class Navigator extends React.Component<PropsType, StateType> {
  appContainer: NavigationContainer<*, *, *>
  state = { waitingForSettings: true }

  async componentDidMount () {
    const { fetchDashboard, clearCategory } = this.props
    const appSettings = new AppSettings()
    const [cityCode, language] = await Promise.all([appSettings.loadSelectedCity(), appSettings.loadContentLanguage()])
    if (!language) {
      throw Error('The contentLanguage has not been set correctly by I18nProvider!')
    }
    if (cityCode) {
      const key = generateKey()
      this.appContainer = createNavigationContainer({
        initialRouteName: 'CityContent', cityCode, language, clearCategory, key
      })
      fetchDashboard({ city: cityCode, language, key })
    } else {
      this.appContainer = createNavigationContainer({ initialRouteName: 'Landing' })
    }

    // see https://github.com/yannickcr/eslint-plugin-react/issues/1110
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ waitingForSettings: false })
  }

  render () {
    const AppContainer = this.appContainer
    return AppContainer ? <AppContainer /> : null
  }
}

export default Navigator
