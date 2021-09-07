import { withTranslation } from 'react-i18next'

import TransparentHeader from '../components/TransparentHeader'
import withTheme from '../hocs/withTheme'

export default withTheme(withTranslation('layout')(TransparentHeader))
