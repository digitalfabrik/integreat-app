// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import LanguageNotAvailablePage from '../../../modules/common/components/LanguageNotAvailablePage'
import { translate } from 'react-i18next'
import compose from 'lodash/fp/compose'

const mapStateToProps = (state: StateType, ownProps) => {
  const {languages, city, eventsRouteMapping} = state.cityContent

  if (!languages) {
    throw new Error('languages have not been set.')
  }
  if (eventsRouteMapping.errorMessage !== undefined) {
    throw new Error('Error was not handled correctly')
  }

  const route = eventsRouteMapping[ownProps.navigation.getParam('key')]

  return {
    city: city,
    languages: languages.filter(language => route.allAvailableLanguages.has(language.code))
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => {
  return {
    changeLanguage: (city: string, newLanguage: string) => dispatch({
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: {
        city,
        newLanguage
      }
    })
  }
}

export default compose([
  connect(mapStateToProps, mapDispatchToProps),
  withTheme(),
  translate('common')
])(LanguageNotAvailablePage)
