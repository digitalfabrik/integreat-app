import 'styled-components/native'

import { ThemeType } from 'build-configs/ThemeType'

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface DefaultTheme extends ThemeType {}
}
