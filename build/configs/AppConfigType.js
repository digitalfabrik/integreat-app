// @flow

import type { ThemeType } from './themes/ThemeType'

export type AppConfigType = {|
  appTitle: string,
  cmsUrl: string,
  theme: ThemeType,
  itunesAppId?: string,
  logoWide: string,
  locationIcon: string,
  internalLinksHijackPattern: string
|}
