// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import setLanguage from '../../../modules/i18n/actions/setLanguage'
import ChangeLanguageModal from '../components/ChangeLanguageModal'
import { withTheme } from 'styled-components'

const mapStateToProps = (state: StateType) => ({})

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => {
  return {
    changeLanguage: (language: string) => dispatch(setLanguage(language))
  }
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(ChangeLanguageModal))
