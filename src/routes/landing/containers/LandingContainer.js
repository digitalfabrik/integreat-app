// @flow

import { withTheme } from 'styled-components/native'
import { translate, withI18n } from 'react-i18next'
import compose from 'lodash/fp/compose'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import Landing from '../components/Landing'
import { StackActions } from 'react-navigation'
import { generateKey } from '../../../modules/app/generateRouteKey'
import { branch, renderComponent } from 'recompose'
import { Failure } from '../../../modules/error/components/Failure'

const mapStateToProps = (state: StateType, ownProps) => {
  if (state.cities.errorMessage !== undefined) {
    return {
      error: true
    }
  }
  return {
    language: ownProps.lng,
    cities: state.cities.models
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

export default compose([
  connect(mapStateToProps, mapDispatchToProps),
  // TODO NATIVE-112
  branch(props => props.error, renderComponent(Failure)),
  withTheme,
  translate('landing'),
  withI18n()
])(Landing)
