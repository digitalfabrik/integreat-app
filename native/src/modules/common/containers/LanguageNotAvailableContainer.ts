import { $Diff } from 'utility-types'
import type { PropsType as LanguageNotAvailablePagePropsType } from '../components/LanguageNotAvailablePage'
import LanguageNotAvailablePage from '../components/LanguageNotAvailablePage'
import withTheme from '../../theme/hocs/withTheme'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
export default withTheme<
  $Diff<
    LanguageNotAvailablePagePropsType,
    {
      t: TFunction
    }
  >
>(withTranslation<LanguageNotAvailablePagePropsType>('common')(LanguageNotAvailablePage))
