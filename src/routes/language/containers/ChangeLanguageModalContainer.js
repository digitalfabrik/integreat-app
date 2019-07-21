// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import ChangeLanguageModal from '../components/ChangeLanguageModal'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import type { NavigationScreenProp } from 'react-navigation'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

type StatePropsType = {|
  currentLanguage: string,
  languages: Array<LanguageModel>,
  availableLanguages: Array<string>
|}

type DispatchPropsType = {|
  changeLanguage: (newLanguage: string) => void
|}

type PropsType = { ...OwnPropsType, ...StatePropsType, ...DispatchPropsType }

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const currentLanguage: string = ownProps.navigation.getParam('currentLanguage')
  const languages: Array<LanguageModel> = ownProps.navigation.getParam('languages')
  const availableLanguages: Array<string> = ownProps.navigation.getParam('availableLanguages')
  return {
    currentLanguage,
    languages,
    availableLanguages
  }
}

type DispatchType = Dispatch<SwitchContentLanguageActionType>
const mapDispatchToProps = (dispatch: DispatchType): DispatchPropsType => {
  return {
    changeLanguage: (newLanguage: string) => {
      dispatch({
        type: 'SWITCH_CONTENT_LANGUAGE',
        params: { newLanguage }
      })
    }
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
  withTheme(props => props.currentLanguage)(ChangeLanguageModal)
)
