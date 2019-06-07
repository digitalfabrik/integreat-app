// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import LanguageNotAvailablePage from '../../../modules/common/components/LanguageNotAvailablePage'
import withTheme from '../../../modules/theme/hocs/withTheme'
import compose from 'lodash/fp/compose'
import { translate } from 'react-i18next'

const mapStateToProps = (state: StateType, ownProps) => {
  const {languages, city, categoriesRouteMapping} = state.cityContent
  const key: string = ownProps.navigation.getParam('key')

  if (!languages) {
    throw new Error('languages have not been set.')
  }
  if (categoriesRouteMapping.errorMessage !== undefined) {
    throw new Error('Error not handled correctly')
  }

  return {
    city: city,
    languages: languages.filter(language => categoriesRouteMapping[key].allAvailableLanguages.has(language.code))
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

export default compose([
  connect(mapStateToProps, mapDispatchToProps),
  withTheme(),
  translate('common')
])(LanguageNotAvailablePage)
