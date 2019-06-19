// @flow

import withTheme from '../../../modules/theme/hocs/withTheme'
import compose from 'lodash/fp/compose'
import { translate, type TFunction } from 'react-i18next'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import Landing from '../components/Landing'
import { type NavigationReplaceAction, StackActions } from 'react-navigation'
import { generateKey } from '../../../modules/app/generateRouteKey'
import withError from '../../../modules/error/hocs/withError'
import { CityModel } from '@integreat-app/integreat-api-client'
import type { NavigationScreenProp } from 'react-navigation'

type OwnPropsType = {| navigation: NavigationScreenProp<*>, i18n: Object, t: TFunction |}

export type PropsType = {|
  error: boolean,
  cities: ?Array<CityModel>,
  navigateToDashboard: (cityCode: string) => StoreActionType,
  fetchCities: () => StoreActionType,
  i18n: Object,
  t: TFunction,
  navigation: NavigationScreenProp<*>
|}

const mapStateToProps = (state: StateType) => {
  if (state.cities.errorMessage !== undefined) {
    return {
      error: true,
      cities: undefined
    }
  }
  return {
    error: false,
    cities: state.cities.models
  }
}

type DispatchType = Dispatch<StoreActionType>

const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnPropsType) => {
  return {
    fetchCities: () => dispatch({
      type: 'FETCH_CITIES'
    }),
    navigateToDashboard: (cityCode: string) => {
      const language = ownProps.i18n.language

      if (!language) {
        throw Error('Failed to get language from i18n prop.')
      }

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
          city: cityCode,
          language,
          path,
          depth: 2,
          criterion: {forceUpdate: false, shouldRefreshResources: true, peek: false, contentType: 'all'},
          key
        }
      })
    }
  }
}

export default compose([
  // translate has to be before connect, because we need to pass the language as prop
  translate('landing'),
  connect<PropsType, OwnPropsType, _, _, _, DispatchType>(mapStateToProps, mapDispatchToProps),
  withError,
  withTheme(props => props.language)
])(Landing)
