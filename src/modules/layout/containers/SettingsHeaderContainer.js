// @flow

import SettingsHeader from '../components/SettingsHeader'
import { withTranslation } from 'react-i18next'

import withTheme from '../../theme/hocs/withTheme'
import { withNavigation } from 'react-navigation'

export default withTheme()(withNavigation(withTranslation('layout')(SettingsHeader)))
