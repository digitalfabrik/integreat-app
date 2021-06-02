import Settings, { PropsType as SettingsPropsType } from './Settings'
import withTheme from '../hocs/withTheme'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { StateType } from '../redux/StateType'
import { Dispatch } from 'redux'
import { StoreActionType } from '../redux/StoreActionType'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import { SettingsRouteType } from 'api-client'

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

export default connect(mapStateToProps)(withTheme<Omit<SettingsPropsType, 't'>>(withTranslation('settings')(Settings)))
