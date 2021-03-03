// @flow

import LanguageNotAvailablePage, {
  type PropsType as LanguageNotAvailablePagePropsType
} from '../components/LanguageNotAvailablePage'
import withTheme from '../../theme/hocs/withTheme'
import { withTranslation, type TFunction } from 'react-i18next'

export default withTheme<$Diff<LanguageNotAvailablePagePropsType, {| t: TFunction |}>>(
  withTranslation<LanguageNotAvailablePagePropsType>('common')(
    LanguageNotAvailablePage
  )
)
