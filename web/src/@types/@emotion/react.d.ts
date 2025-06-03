import '@emotion/react'

import { LegacyThemeType } from 'build-configs/LegacyThemeType'
import { UiDirectionType } from 'translations'

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface Theme extends LegacyThemeType {
    contentDirection: UiDirectionType
    isContrastTheme: boolean
  }
}
