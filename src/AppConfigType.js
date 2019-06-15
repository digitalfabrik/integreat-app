// @flow

import type { ThemeType } from './modules/theme/constants/theme'

export type AppConfigType = {|
  appTitle: string,
  favicon: string,
  cmsUrl: string,
  theme: ThemeType,
  itunesAppId?: string
|}
