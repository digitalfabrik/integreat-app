import 'styled-components'

import { LegacyThemeType } from 'build-configs/LegacyThemeType'
import { UiDirectionType } from 'translations'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface DefaultTheme extends LegacyThemeType {
    contentDirection: UiDirectionType
    isContrastTheme?: boolean
  }
}
