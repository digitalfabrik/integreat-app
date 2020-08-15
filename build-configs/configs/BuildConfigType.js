// @flow

import type { ThemeType } from '../themes/ThemeType'
import type { FeatureFlagsType } from './featureFlags'

export type LocalesType = { [namespace: string]: { [language: string]: { [key: string]: string } } }

export type BuildConfigType = {|
  appName: string,
  cmsUrl: string,
  featureFlags: FeatureFlagsType,
  theme: ThemeType,
  darkTheme: ThemeType,
  manifestUrl?: string,
  itunesAppId?: string,
  localesOverride?: LocalesType,
  logoWide: string,
  locationIcon: string,
  internalLinksHijackPattern: string,
  splashScreen?: {| backgroundColor: string, imageUrl: string |}
|}
