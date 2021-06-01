import 'styled-components'
import { ThemeType } from 'build-configs/ThemeType'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ThemeType {}
}
