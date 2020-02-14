// @flow

import TransparentHeader from '../components/TransparentHeader'
import { withTranslation } from 'react-i18next'

import withTheme from '../../theme/hocs/withTheme'
import { withNavigation } from 'react-navigation'

export default withTheme()(withNavigation(withTranslation('layout')(TransparentHeader)))
