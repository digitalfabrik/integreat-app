// @flow

import type { ThemeType } from '../themes/ThemeType'
import type { FeatureFlagsType } from './featureFlags'

export type BuildConfigType = {|
  appTitle: string,
  cmsUrl: string,
  switchCmsUrl?: string,
  featureFlags: FeatureFlagsType,
  theme: ThemeType,
  darkTheme: ThemeType
|}
