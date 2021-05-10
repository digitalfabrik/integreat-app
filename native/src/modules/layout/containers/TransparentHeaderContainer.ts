import { PropsType as TransparentHeaderPropsType } from '../components/TransparentHeader'
import TransparentHeader from '../components/TransparentHeader'
import { withTranslation } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
export default withTheme(withTranslation<TransparentHeaderPropsType>('layout')(TransparentHeader))
