// @flow

import type { ThemeType } from '../themes/ThemeType'

export type LocalesType = { [namespace: string]: { [language: string]: { [key: string]: string } } }

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
  localesOverride?: LocalesType,
  iconSet: string,
  development?: boolean,
  e2e?: boolean
|}
