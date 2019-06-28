// @flow

import LanguageNotAvailablePage from '../components/LanguageNotAvailablePage'
import withTheme from '../../theme/hocs/withTheme'
import { translate } from 'react-i18next'

export default withTheme()(
  translate('common')(
    LanguageNotAvailablePage
  )
)
