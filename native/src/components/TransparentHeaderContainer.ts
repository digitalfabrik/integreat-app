import TransparentHeader from '../components/TransparentHeader'
import { withTranslation } from 'react-i18next'
import withTheme from '../hocs/withTheme'

export default withTheme(withTranslation('layout')(TransparentHeader))
