// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import ChangeLanguageModal from '../components/ChangeLanguageModal'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import type { NavigationScreenProp } from 'react-navigation'
import { withTranslation } from 'react-i18next'
import type { TFunction } from 'react-i18next'

type OwnPropsType = {| navigation: NavigationScreenProp<*>, t: TFunction |}

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
const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnPropsType): DispatchPropsType => {
  return {
    changeLanguage: (newLanguage: string) => {
      dispatch({
        type: 'SWITCH_CONTENT_LANGUAGE',
        params: { newLanguage, city: ownProps.navigation.getParam('cityCode'), t: ownProps.t }
      })
    }
  }
}

export default withTranslation('error')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
    withTheme(props => props.currentLanguage)(ChangeLanguageModal)
  )
)
