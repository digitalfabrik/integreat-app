import 'styled-components'

import { ThemeType } from 'build-configs/ThemeType'
import { UiDirectionType } from 'translations'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface DefaultTheme extends ThemeType {
    contentDirection: UiDirectionType
    isContrastTheme?: boolean
  }
}
