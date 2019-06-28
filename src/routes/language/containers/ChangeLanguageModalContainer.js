// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import ChangeLanguageModal from '../components/ChangeLanguageModal'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { currentCityRouteSelector } from '../../../modules/common/selectors/currentCityRouteSelector'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import type { NavigationScreenProp } from 'react-navigation'
import { availableLanguagesSelector } from '../../../modules/common/selectors/availableLanguagesSelector'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

type PropsType = {|
  city: string,
  currentLanguage: string,
  languages: Array<LanguageModel>,
  availableLanguages: Array<string>,
  changeLanguage: (city: string, newLanguage: string) => void,
  closeModal: () => void,
  navigation: NavigationScreenProp<*>
|}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType) => {
  if (!state.cityContent) {
    throw new Error('CityContent must not be null!')
  }

  const cityContent = state.cityContent
  const { city, languages } = cityContent

  const routeKey = ownProps.navigation.getParam('routeKey')
  const route = currentCityRouteSelector(cityContent, { routeKey })
  const currentLanguage = route ? route.language : state.contentLanguage
  const availableLanguages = availableLanguagesSelector(cityContent, { routeKey })

  return {
    city,
    currentLanguage,
    languages,
    availableLanguages,
    closeModal: () => { ownProps.navigation.goBack() }
  }
}

type DispatchType = Dispatch<SwitchContentLanguageActionType>
const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    changeLanguage: (city: string, newLanguage: string) => {
      dispatch({
        type: 'SWITCH_CONTENT_LANGUAGE',
        params: {
          city,
          newLanguage
        }
      })
    }
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
  withTheme(props => props.language)(ChangeLanguageModal)
)
