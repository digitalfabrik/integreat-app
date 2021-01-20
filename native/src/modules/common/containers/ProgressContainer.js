// @flow

import { withTranslation } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import ProgressSpinner from '../components/ProgressSpinner'

export default withTheme(withTranslation('common')(ProgressSpinner))
