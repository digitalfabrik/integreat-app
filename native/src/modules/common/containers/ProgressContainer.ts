import { withTranslation } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import type { PropsType as ProgressSpinnerPropsType } from '../components/ProgressSpinner'
import ProgressSpinner from '../components/ProgressSpinner'
export default withTheme(withTranslation<ProgressSpinnerPropsType>('common')(ProgressSpinner))
