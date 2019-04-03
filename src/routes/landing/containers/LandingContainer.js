// @flow

import { withTheme } from 'styled-components/native'
import { translate, withI18n } from 'react-i18next'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import Landing from '../components/Landing'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'

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
    navigateToCategory: createNavigateToCategory('Dashboard', dispatch, ownProps.navigation)
  }
}

// $FlowFixMe
const themed = withTheme(Landing)
export default translate('landing')(withI18n()(connect(mapStateToProps, mapDispatchToProps)(themed)))
