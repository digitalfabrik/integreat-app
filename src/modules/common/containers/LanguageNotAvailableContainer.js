// @flow

import LanguageNotAvailablePage from '../components/LanguageNotAvailablePage'
import withTheme from '../../theme/hocs/withTheme'
import { withTranslation } from 'react-i18next'

export default withTheme()(
  withTranslation('common')(
    LanguageNotAvailablePage
  )
)
