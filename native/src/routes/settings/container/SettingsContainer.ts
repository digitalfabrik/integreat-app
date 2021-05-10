import { PropsType as SettingsPropsType } from '../components/Settings'
import Settings from '../components/Settings'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { StateType } from '../../../modules/app/StateType'
import { Dispatch } from 'redux'
import 'redux'
import { StoreActionType } from '../../../modules/app/StoreActionType'
import { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import { SettingsRouteType } from 'api-client/src/routes'
type OwnPropsType = {
  route: RoutePropType<SettingsRouteType>
  navigation: NavigationPropType<SettingsRouteType>
}
type StatePropsType = {
  languageCode: string
  cityCode: string | null | undefined
}
type PropsType = OwnPropsType &
  StatePropsType & {
    dispatch: Dispatch<StoreActionType>
  }

const mapStateToProps = (state: StateType): StatePropsType => {
  return {
    languageCode: state.contentLanguage,
    cityCode: state.cityContent?.city
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTheme<
    Omit<
      SettingsPropsType,
        "t"
    >
  >(withTranslation('settings')(Settings))
)
