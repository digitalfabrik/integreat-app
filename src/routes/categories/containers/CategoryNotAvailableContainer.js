// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { CategoryRouteStateType, StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import PageNotAvailable from '../../../modules/common/components/PageNotAvailable'
import { withTheme } from 'styled-components/native'
import compose from 'lodash/fp/compose'
import { translate } from 'react-i18next'

const mapStateToProps = (state: StateType, ownProps) => {
  const key: string = ownProps.navigation.getParam('key')
  const route: CategoryRouteStateType = state.cityContent.categoriesRouteMapping[key]
  const languages = state.cityContent.languages
  if (!languages) {
    throw new Error('languages have not been set.')
  }

  return {
    city: state.cityContent.city,
    languages: languages.filter(language => route.allAvailableLanguages.has(language.code))
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => {
  return {
    changeLanguage: (city: string, newLanguage: string) => dispatch({
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: { city, newLanguage }
    })
  }
}

// $FlowFixMe
export default compose(
  withTheme,
  connect(mapStateToProps, mapDispatchToProps),
  translate('common')
)(PageNotAvailable)
