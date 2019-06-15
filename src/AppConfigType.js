// @flow

import type { ThemeType } from './modules/theme/constants/theme'

export type AppConfigType = {|
  appTitle: string,
  cmsUrl: string,
  theme: ThemeType,
  itunesAppId?: string
|}
