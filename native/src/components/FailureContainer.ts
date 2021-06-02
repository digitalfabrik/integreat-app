import { withTranslation } from 'react-i18next'
import Failure from '../components/Failure'
import withTheme from '../hocs/withTheme'

export default withTheme(withTranslation('error')(Failure))
