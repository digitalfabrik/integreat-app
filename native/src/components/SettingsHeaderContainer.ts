import { withTranslation } from 'react-i18next'

import SettingsHeader from '../components/SettingsHeader'
import withTheme from '../hocs/withTheme'

export default withTheme(withTranslation('layout')(SettingsHeader))
