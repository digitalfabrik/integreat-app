// @flow

import { withTranslation } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import ProgressBar from '../components/ProgressBar'

export default withTheme(withTranslation('common')(ProgressBar))
