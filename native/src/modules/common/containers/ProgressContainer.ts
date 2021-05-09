// @flow

import { withTranslation } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import ProgressSpinner, { type PropsType as ProgressSpinnerPropsType } from '../components/ProgressSpinner'

export default withTheme(withTranslation<ProgressSpinnerPropsType>('common')(ProgressSpinner))
