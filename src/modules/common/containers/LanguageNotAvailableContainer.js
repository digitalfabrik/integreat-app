// @flow

import LanguageNotAvailablePage from '../components/LanguageNotAvailablePage'
import { withTheme } from 'styled-components/native'
import compose from 'lodash/fp/compose'
import { translate } from 'react-i18next'

export default compose(
  withTheme,
  translate('common')
)(LanguageNotAvailablePage)
