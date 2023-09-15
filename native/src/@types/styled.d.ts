import 'styled-components/native'

import { ThemeType } from 'build-configs/ThemeType'

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface,@typescript-eslint/consistent-type-definitions
  export interface DefaultTheme extends ThemeType {}
}
