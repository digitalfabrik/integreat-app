// @flow

import Settings from '../components/Settings'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import { type Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import type {
  SettingsRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/components/NavigationTypes'

type OwnPropsType = {|
  route: RoutePropType<SettingsRouteType>,
  navigation: NavigationPropType<SettingsRouteType>
|}

type StatePropsType = {|
  languageCode: string,
  cityCode: ?string
|}

type PropsType = {|
  ...OwnPropsType,
  ...StatePropsType,
  dispatch: Dispatch<StoreActionType>
|}

const mapStateToProps = (state: StateType): StatePropsType => {
  return { languageCode: state.contentLanguage, cityCode: state.cityContent?.city }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTheme(withTranslation('settings')(Settings))
)
