// @flow

import { withTranslation } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import Failure, { type PropsType as FailurePropsType } from '../components/Failure'

export default withTheme(withTranslation<FailurePropsType>('error')(Failure))
