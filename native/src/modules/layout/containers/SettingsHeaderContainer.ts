import type { PropsType as SettingsHeaderPropsType } from '../components/SettingsHeader'
import SettingsHeader from '../components/SettingsHeader'
import { withTranslation } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
export default withTheme(withTranslation<SettingsHeaderPropsType>('layout')(SettingsHeader))
