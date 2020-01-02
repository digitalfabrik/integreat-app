// @flow

import React from 'react'
import Snackbar from '../components/Snackbar'
import type { ThemeType } from '../../theme/constants/theme'
import { withNavigation, type NavigationScreenProp } from 'react-navigation'
import { translate, type TFunction } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'

type PropsType = {|
  navigation: NavigationScreenProp<*>,
  t: TFunction,
  theme: ThemeType
|}

class PermissionSnackbarContainer extends React.Component<PropsType> {
  render () {
    return <Snackbar message={'asdf'} positiveAction={{ label: 'asdf', onPress: () => {} }} theme={this.props.theme} />
  }
}

export default
  translate('snackbar')(
    withTheme()(
      PermissionSnackbarContainer
  )
)
