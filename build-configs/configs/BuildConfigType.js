// @flow

import type { ThemeType } from '../themes/ThemeType'
import type { FeatureFlagsType } from './featureFlags'

export type BuildConfigType = {|
  appName: string,
  cmsUrl: string,
  featureFlags: FeatureFlagsType,
  theme: ThemeType,
  darkTheme: ThemeType,
  manifestUrl?: string,
  itunesAppId?: string,
  logoWide: string,
  iconSet: {
    locationIcon: string,
    logoWide: string,
  },
  internalLinksHijackPattern: string,
  splashScreen?: {| backgroundColor: string, imageUrl: string |}
|}
