// @flow
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { translate } from 'react-i18next'

import Header from '../components/Header'
import withTheme from '../../theme/hocs/withTheme'
import type { StateType } from '../../app/StateType'
import { availableLanguagesSelector } from '../../common/selectors/availableLanguagesSelector'
import { type Dispatch } from 'redux'
import type { StoreActionType } from '../../app/StoreActionType'
import compose from 'lodash/fp/compose'

const mapStateToProps = (state: StateType, ownProps) => {
  const routeKey = ownProps.navigation.getParam('key')
  return {
    availableLanguages: availableLanguagesSelector(state, {routeKey}),
    routeMapping: state.cityContent.categoriesRouteMapping,
    routeKey
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => ({
  navigateToLanding: () => {
    dispatch({type: 'CLEAR_CITY_CONTENT'})
    ownProps.navigation.navigate('Landing')
  }
})

export default compose([
  withNavigation,
  translate('header'),
  connect(mapStateToProps, mapDispatchToProps),
  withTheme(props => props.language)
])(Header)
