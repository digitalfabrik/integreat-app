// @flow
import TransparentHeader from '../components/TransparentHeader'
import { translate } from 'react-i18next'

import withTheme from '../../theme/hocs/withTheme'
import { withNavigation } from 'react-navigation'

export default withTheme()(withNavigation(translate('header')(TransparentHeader)))
