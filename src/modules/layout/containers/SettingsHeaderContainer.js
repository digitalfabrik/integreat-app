// @flow

import SettingsHeader from '../components/SettingsHeader'
import { translate } from 'react-i18next'

import withTheme from '../../theme/hocs/withTheme'
import { withNavigation } from 'react-navigation'

export default withTheme()(withNavigation(translate('layout')(SettingsHeader)))
