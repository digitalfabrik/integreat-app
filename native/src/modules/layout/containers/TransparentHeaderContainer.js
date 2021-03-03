// @flow

import TransparentHeader, { type PropsType as TransparentHeaderPropsType } from '../components/TransparentHeader'
import { withTranslation } from 'react-i18next'

import withTheme from '../../theme/hocs/withTheme'

export default withTheme(withTranslation<TransparentHeaderPropsType>('layout')(TransparentHeader))
