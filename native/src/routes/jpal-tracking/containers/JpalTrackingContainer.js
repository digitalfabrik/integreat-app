// @flow

import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import withTheme from '../../../modules/theme/hocs/withTheme'
import JpalTracking, { type PropsType as JpalTrackingPropsType } from '../components/JpalTracking'

export default withTheme<$Diff<JpalTrackingPropsType, {| t: TFunction |}>>(
  withTranslation<JpalTrackingPropsType>('settings')(JpalTracking)
)
