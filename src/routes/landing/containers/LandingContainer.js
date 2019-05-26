// @flow

import { withTheme } from 'styled-components/native'
import { translate, withI18n } from 'react-i18next'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import Landing from '../components/Landing'
import { StackActions } from 'react-navigation'
import { generateKey } from '../../../modules/app/generateRouteKey'

const mapStateToProps = (state: StateType, ownProps) => {
  const cities = state.cities.models
  return {
    language: ownProps.lng,
    cities: cities.length === 0 ? undefined : cities
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => {
  return {
    fetchCities: () => dispatch({
      type: 'FETCH_CITIES',
      params: {}
    }),
    navigateToDashboard: (cityCode: string, language: string) => {
      const path = `/${cityCode}/${language}`
      const key: string = generateKey()
      ownProps.navigation.navigate({
        routeName: 'App',
        action: StackActions.replace({
          routeName: 'Dashboard',
          params: {
            cityCode,
            key,
            sharePath: path,
            onRouteClose: () => dispatch({type: 'CLEAR_CATEGORY', params: {key}})
          },
          newKey: key
        })
      })

      return dispatch({
        type: 'FETCH_CATEGORY',
        params: {
          city: cityCode, language, path, depth: 2, forceUpdate: false, key
        }
      })
    }
  }
}

// $FlowFixMe
const themed = withTheme(Landing)
export default translate('landing')(withI18n()(connect(mapStateToProps, mapDispatchToProps)(themed)))
