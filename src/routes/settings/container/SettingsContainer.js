// @flow

import Settings from '../components/Settings'
import { withTheme } from 'styled-components/native'
import type { NavigationScreenProp } from 'react-navigation'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

type PropsType = {|
  navigation: NavigationScreenProp<*>,
  language: string | null,
  dispatch: () => {}
|}

const mapStateToProps = (state: StateType) => {
  return {
    language: state.cityContent.language
  }
}

const ThemedSettings = withTheme<PropsType, _>(translate('settings')(Settings))
export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  ThemedSettings
)
