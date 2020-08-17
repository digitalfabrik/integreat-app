// @flow

import type { ThemeType } from '../themes/ThemeType'

export type FeatureFlagsType = {|
  pois: boolean,
  newsStream: boolean,
  introSlides: boolean
|}

export type BuildConfigType = {|
  appName: string,
  cmsUrl: string,
  switchCmsUrl?: string,
  allowedHostNames: Array<string>,
  featureFlags: FeatureFlagsType,
  lightTheme: ThemeType,
  darkTheme: ThemeType,
  iconSet: string,
  development?: boolean,
  e2e?: boolean
|}
