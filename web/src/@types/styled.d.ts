import 'styled-components'
import { ThemeType } from 'build-configs/ThemeType'

declare module 'styled-components' {
  export type DefaultTheme = ThemeType
}
