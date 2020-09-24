// @flow

import type { ThemeType } from './ThemeType'

export type LocalesType = { [namespace: string]: { [language: string]: { [key: string]: string } } }

export type BuildConfigType = {|
  appName: string,
  cmsUrl: string,
  featureFlags: {|
    pois: boolean,
    newsStream: boolean
  |},
  theme: ThemeType,
  darkTheme: ThemeType,
  manifestUrl?: string,
  itunesAppId?: string,
  localesOverride?: LocalesType,
  icons: {
    locationIcon: string,
    headerLogo: string,
  },
  internalLinksHijackPattern: string,
  splashScreen?: {| backgroundColor: string, imageUrl: string |}
|}
