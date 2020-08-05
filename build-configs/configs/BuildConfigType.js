// @flow

import type { ThemeType } from '../themes/ThemeType'

export type FeatureFlagsType = {|
  pois: boolean,
  newsStream: boolean,
  introSlides: boolean
|}

export type BuildConfigType = {|
  applicationId: string,
  appName: string,
  cmsUrl: string,
  switchCmsUrl?: string,
  allowedHostNames: Array<string>,
  featureFlags: FeatureFlagsType,
  lightTheme: ThemeType,
  darkTheme: ThemeType,
  development?: boolean,
  e2e?: boolean
|}
