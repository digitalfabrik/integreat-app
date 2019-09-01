// @flow

import { type Dispatch } from 'redux'
import { connect } from 'react-redux'
import type { StoreActionType } from '../StoreActionType'
import Navigator from '../components/Navigator'
import type { NavigationAction } from 'react-navigation'
import React from 'react'
import AppSettings from '../../settings/AppSettings'
import type { NavigateToCityContentParamsType } from '../createNavigateToCityContent'
import createNavigateToCityContent from '../createNavigateToCityContent'

type DispatchPropsType = {|
  setContentLanguage: (language: string) => void,
  navigateToCityContent: NavigateToCityContentParamsType => NavigationAction,
  fetchCities: (forceRefresh: boolean) => void
|}

type PropsType = DispatchPropsType

type ContainerStateType = {| waitingForSettings: boolean, language?: ?string, cityCode?: ?string |}

class NavigatorContainer extends React.Component<DispatchPropsType, ContainerStateType> {
  constructor () {
    super()
    this.state = { waitingForSettings: true }
    const appSettings = new AppSettings()
    Promise.all([appSettings.loadSelectedCity(), appSettings.loadContentLanguage()]).then(
      ([cityCode: ?string, language: ?string]) => this.setState({
        waitingForSettings: false, cityCode, language
      })
    )
  }

  render () {
    return this.state.waitingForSettings
      ? null
      : <Navigator {...this.props} contentLanguage={this.state.language} selectedCity={this.state.cityCode} />
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  setContentLanguage: (language: string) => {
    dispatch({
      type: 'SET_CONTENT_LANGUAGE',
      params: { contentLanguage: language }
    })
  },
  fetchCities: (forceRefresh: boolean) => {
    dispatch({ type: 'FETCH_CITIES', params: { forceRefresh } })
  },
  navigateToCityContent: createNavigateToCityContent(dispatch)
})

export default connect<PropsType, {||}, _, _, _, _>(undefined, mapDispatchToProps)(NavigatorContainer)
