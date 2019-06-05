// @flow

import Settings from '../components/Settings'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { NavigationScreenProp } from 'react-navigation'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

type PropsType = {|
  navigation: NavigationScreenProp<*>,
  language: string,
  dispatch: () => {}
|}

const mapStateToProps = (state: StateType) => {
  const language = state.cityContent.language

  if (!language) {
    throw Error('language in state is not defined')
  }

  return {
    language: language
  }
}

const ThemedSettings = withTheme(props => props.language)(translate('settings')(Settings))
export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTheme(translate('settings')(Settings))
)
