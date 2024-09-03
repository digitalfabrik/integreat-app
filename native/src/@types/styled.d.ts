import 'styled-components'

import { ThemeType } from 'build-configs/ThemeType'

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends ThemeType {}
}
