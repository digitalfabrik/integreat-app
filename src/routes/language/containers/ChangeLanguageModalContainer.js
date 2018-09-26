// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import setLanguage from '../../../modules/i18n/actions/setLanguage'
import ChangeLanguageModal from '../components/ChangeLanguageModal'
import { withTheme } from 'styled-components'
import languagesEndpoint from 'modules/endpoint/endpoints/languages'

const mapStateToProps = (state: StateType, ownProps) => {
  const city = state.currentCity

  if (!city) {
    throw new Error(`There is no current city`)
  }

  const cityInState = state.languages[city]

  if (!cityInState) {
    throw new Error(`No languages for ${city} found`)
  }

  return {
    languages: languagesEndpoint.mapResponse(cityInState.languages, {city}),
    closeModal: () => ownProps.navigation.goBack()
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => {
  return {
    changeLanguage: (language: string) => dispatch(setLanguage(language))
  }
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(ChangeLanguageModal))
