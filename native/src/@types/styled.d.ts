import 'styled-components/native'

import { LegacyThemeType } from 'build-configs/LegacyThemeType'

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface DefaultTheme extends LegacyThemeType {}
}
