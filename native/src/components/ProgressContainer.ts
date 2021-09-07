import { withTranslation } from 'react-i18next'

import ProgressSpinner from '../components/ProgressSpinner'
import withTheme from '../hocs/withTheme'

export default withTheme(withTranslation('common')(ProgressSpinner))
