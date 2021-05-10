import LanguageNotAvailablePage, { PropsType as LanguageNotAvailablePagePropsType } from '../components/LanguageNotAvailablePage'
import withTheme from '../../theme/hocs/withTheme'
import { withTranslation } from 'react-i18next'

export default withTheme<Omit<LanguageNotAvailablePagePropsType, 't'>>(
  withTranslation('common')(LanguageNotAvailablePage)
)
