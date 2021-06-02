import LanguageNotAvailablePage, {
  PropsType as LanguageNotAvailablePagePropsType
} from '../components/LanguageNotAvailablePage'
import { withTranslation } from 'react-i18next'
import withTheme from '../hocs/withTheme'

export default withTheme<Omit<LanguageNotAvailablePagePropsType, 't'>>(
  withTranslation('common')(LanguageNotAvailablePage)
)
