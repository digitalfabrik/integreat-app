// @flow

import { withTheme } from 'styled-components/native'
import { translate, type TFunction } from 'react-i18next'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import Landing from '../components/Landing'
import { type NavigationReplaceAction, StackActions } from 'react-navigation'
import { generateKey } from '../../../modules/app/generateRouteKey'
import { CityModel } from '@integreat-app/integreat-api-client'
import type { NavigationScreenProp } from 'react-navigation'

const mapStateToProps = (state: StateType) => {
  const cities = state.cities.models
  return {
    cities: cities.length === 0 ? undefined : cities
  }
}

type OwnPropsType = {| navigation: NavigationScreenProp<*>, i18n: Object, t: TFunction |}

export type PropsType = {|
  cities?: Array<CityModel>,
  navigateToDashboard: (cityCode: string) => StoreActionType,
  fetchCities: () => StoreActionType,
  i18n: Object,
  t: TFunction,
  navigation: NavigationScreenProp<*>
|}

type DispatchType = Dispatch<StoreActionType>

const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnPropsType) => {
  return {
    fetchCities: () => dispatch({
      type: 'FETCH_CITIES',
      params: {}
    }),
    navigateToDashboard: (cityCode: string) => {
      const language = ownProps.i18n.lng
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
        type: 'FETCH_LANGUAGES_FOR_CATEGORY',
        params: {
          city: cityCode, language, path, depth: 2, forceUpdate: false, key
        }
      })
    }
  }
}

export default translate('landing')(
  connect<PropsType, OwnPropsType, _, _, _, DispatchType>(mapStateToProps, mapDispatchToProps)(
    withTheme(Landing)
  )
)
