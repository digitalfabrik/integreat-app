import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { LanguageModel, ChangeLanguageModalRouteType } from 'api-client'
import { ThemeType } from 'build-configs'

import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withTheme from '../hocs/withTheme'
import { StateType } from '../redux/StateType'
import { StoreActionType } from '../redux/StoreActionType'
import ChangeLanguageModal from './ChangeLanguageModal'

type OwnPropsType = {
  route: RoutePropType<ChangeLanguageModalRouteType>
  navigation: NavigationPropType<ChangeLanguageModalRouteType>
}
type StatePropsType = {
  currentLanguage: string
  languages: Array<LanguageModel>
  availableLanguages: Array<string>
}
type DispatchPropsType = {
  changeLanguage: (newLanguage: string) => void
}
type PropsType = OwnPropsType & StatePropsType & DispatchPropsType

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const { currentLanguage, languages, availableLanguages } = ownProps.route.params
  return {
    currentLanguage,
    languages,
    availableLanguages
  }
}

type DispatchType = Dispatch<StoreActionType>

const mapDispatchToProps = (dispatch: DispatchType, ownProps: OwnPropsType): DispatchPropsType => {
  const { cityCode } = ownProps.route.params
  return {
    changeLanguage: (newLanguage: string) => {
      dispatch({
        type: 'SWITCH_CONTENT_LANGUAGE',
        params: {
          newLanguage,
          city: cityCode
        }
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTheme<
    PropsType & {
      theme: ThemeType
    }
  >(ChangeLanguageModal)
)
