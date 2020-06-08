// @flow

import type { ThemeType } from '../themes/ThemeType'
import type { FeatureFlagsType } from './featureFlags'

export type BuildConfigType = {|
  appTitle: string,
  cmsUrl: string,
  featureFlags: FeatureFlagsType,
  theme: ThemeType,
  darkTheme: ThemeType,
  itunesAppId?: string,
  logoWide: string,
  locationIcon: string,
  internalLinksHijackPattern: string
|}
