// @flow

import * as React from 'react'
import type { NavigationContainer } from 'react-navigation'
import { generateKey } from '../generateRouteKey'
import AppSettings from '../../settings/AppSettings'
import createAppContainer from '../createAppContainer'
import { Text } from 'react-native'
import initSentry from '../initSentry'
import { ASYNC_STORAGE_VERSION } from '../../settings/constants'
import buildConfig from '../constants/buildConfig'

type PropsType = {|
  fetchCategory: (cityCode: string, language: string, key: string) => void,
  clearCategory: (key: string) => void,
  fetchCities: (forceRefresh: boolean) => void
|}

type StateType = {| waitingForSettings: boolean, errorMessage: null |}

class Navigator extends React.Component<PropsType, StateType> {
  _appNavigationContainer: ?NavigationContainer<*, *, *>
  state = { waitingForSettings: true, errorMessage: null }

  componentDidMount () {
    const { fetchCities } = this.props
    fetchCities(false)
    this.initializeAppContainer().catch(error => this.setState({ errorMessage: error.message }))
  }

  async initializeAppContainer () {
    const { fetchCategory, clearCategory } = this.props

    if (global.HermesInternal) {
      console.log('App is using Hermes: https://reactnative.dev/docs/hermes')
    }

    const appSettings = new AppSettings()
    const {
      introShown,
      selectedCity,
      contentLanguage,
      storageVersion,
      errorTracking
    } = await appSettings.loadSettings()

    if (!storageVersion) {
      await appSettings.setVersion(ASYNC_STORAGE_VERSION)
    }

    if (storageVersion !== ASYNC_STORAGE_VERSION) {
      // start a migration routine
    }

    if (!contentLanguage) {
      throw Error('The contentLanguage has not been set correctly by I18nProvider!')
    }

    if (!buildConfig().featureFlags.introSlides) {
      await appSettings.setIntroShown()
      await appSettings.setSettings({ errorTracking: false, allowPushNotifications: false, proposeNearbyCities: false })
    }

    if (buildConfig().featureFlags.introSlides && !introShown) {
      this._appNavigationContainer = createAppContainer({ initialRouteName: 'Intro' })
    } else {
      if (errorTracking) {
        initSentry()
      }

      if (selectedCity) {
        const key = generateKey()
        this._appNavigationContainer = createAppContainer({
          initialRouteName: 'CityContent', cityCode: selectedCity, language: contentLanguage, clearCategory, key
        })
        fetchCategory(selectedCity, contentLanguage, key)
      } else {
        this._appNavigationContainer = createAppContainer({ initialRouteName: 'Landing' })
      }
    }

    this.setState({ waitingForSettings: false })
  }

  render () {
    const { errorMessage } = this.state
    if (errorMessage) {
      return <Text>{errorMessage}</Text>
    }
    const AppContainer = this._appNavigationContainer
    return AppContainer ? <AppContainer /> : null
  }
}

export default Navigator
