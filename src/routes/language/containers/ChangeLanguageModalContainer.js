// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import ChangeLanguageModal from '../components/ChangeLanguageModal'
import { withTheme } from 'styled-components/native'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import type { NavigationScreenProp } from 'react-navigation'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

type PropsType = {
  city: string | null,
  currentLanguage: string | null,
  languages: Array<LanguageModel> | null,
  availableLanguages: Array<string>,
  changeLanguage: (city: string, language: string) => SwitchContentLanguageActionType,
  closeModal: () => void
}

const mapStateToProps = (state: StateType, ownProps) => {
  return {
    city: state.cityContent.city,
    currentLanguage: state.cityContent.language,
    languages: state.cityContent.languages,
    availableLanguages: ownProps.navigation.getParam('availableLanguages'),
    closeModal: () => { ownProps.navigation.goBack() }
  }
}

type DispatchType = Dispatch<SwitchContentLanguageActionType>
const mapDispatchToProps = (dispatch: DispatchType) => {
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

export default connect<PropsType, OwnPropsType, _, _, _, DispatchType>(mapStateToProps, mapDispatchToProps)(
  withTheme(ChangeLanguageModal)
)
