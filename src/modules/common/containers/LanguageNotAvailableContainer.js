// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import LanguageNotAvailablePage from '../../../modules/common/components/LanguageNotAvailablePage'
import { withTheme } from 'styled-components/native'
import compose from 'lodash/fp/compose'
import { translate } from 'react-i18next'

const mapStateToProps = (state: StateType) => {
  const languages = state.cityContent.languages
  if (!languages) {
    throw new Error('languages have not been set.')
  }

  return {
    city: state.cityContent.city,
    languages
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

export default compose(
  withTheme,
  connect(mapStateToProps, mapDispatchToProps),
  translate('common')
)(LanguageNotAvailablePage)
