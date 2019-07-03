// @flow

import withTheme from '../../../modules/theme/hocs/withTheme'
import { translate, type TFunction } from 'react-i18next'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import Landing from '../components/Landing'
import { type NavigationReplaceAction, StackActions } from 'react-navigation'
import { generateKey } from '../../../modules/app/generateRouteKey'
import withError from '../../../modules/error/hocs/withError'
import { CityModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { NavigationScreenProp } from 'react-navigation'
import type { PropsType as LandingPropsType } from '../components/Landing'

type OwnPropsType = {| navigation: NavigationScreenProp<*>, i18n: Object, t: TFunction |}

export type StatePropsType = {|
  error: boolean,
  languageNotAvailable: boolean,
  availableLanguages?: Array<LanguageModel>,
  currentCityCode?: string,
  cities?: Array<CityModel>,
  language: string
|}

type DispatchPropsType = {|
  navigateToDashboard: (cityCode: string, language: string) => StoreActionType,
  changeUnavailableLanguage?: (city: string, newLanguage: string) => void
|}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType): StatePropsType => {
  const language = state.contentLanguage
  if (state.cities.errorMessage !== undefined) {
    return { error: true, languageNotAvailable: false, language }
  }

  if (!state.cities.models) {
    return { error: false, languageNotAvailable: false, language }
  }
  return { error: false, languageNotAvailable: false, cities: state.cities.models, language }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps: OwnPropsType): DispatchPropsType => {
  return {
    navigateToDashboard: (cityCode: string, language: string) => {
      const path = `/${cityCode}/${language}`
      const key: string = generateKey()

      const action: NavigationReplaceAction = StackActions.replace({
        routeName: 'Dashboard',
        params: {
          cityCode,
          key,
          sharePath: path,
          onRouteClose: () => dispatch({type: 'CLEAR_CATEGORY', params: {key}})
        },
        newKey: key
      })

      ownProps.navigation.navigate({
        routeName: 'App',
        // $FlowFixMe For some reason action is not allowed to be a StackAction
        action: action
      })

      return dispatch({
        type: 'FETCH_CATEGORY',
        params: {
          city: cityCode, language, path, depth: 2, forceUpdate: false, shouldRefreshResources: true, key
        }
      })
    }
  }
}

export default translate('landing')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    withTheme(props => props.language)(
      withError<LandingPropsType>(
        Landing
      ))))
