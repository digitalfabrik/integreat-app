// @flow

import type { ThemeType } from '../themes/ThemeType'
import type { FeatureFlagsType } from './featureFlags'

export type BuildConfigType = {|
  appName: string,
  cmsUrl: string,
  switchCmsUrl?: string,
  allowedHostNames: Array<string>,
  featureFlags: FeatureFlagsType,
  lightTheme: ThemeType,
  darkTheme: ThemeType
|}
