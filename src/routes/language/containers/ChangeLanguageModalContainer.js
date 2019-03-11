// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import ChangeLanguageModal from '../components/ChangeLanguageModal'
import { withTheme } from 'styled-components'

const mapStateToProps = (state: StateType, ownProps) => {
  return {
    city: state.categoriesSelection.currentCity,
    languages: state.categoriesSelection.languages,
    closeModal: () => ownProps.navigation.goBack()
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => {
  return {
    changeLanguage: (city: string, language: string) => dispatch({
      type: 'FETCH_CATEGORY',
      params: {
        city, language, selectParams: undefined
      }
    })
  }
}

// $FlowFixMe
export default withTheme(connect(mapStateToProps, mapDispatchToProps)(ChangeLanguageModal))
