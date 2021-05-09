// @flow

import buildConfig from '../../app/constants/buildConfig'
import type { ThemeType } from 'build-configs/ThemeType'

export type { ThemeType }

export const lightTheme: ThemeType = buildConfig().lightTheme

export const darkTheme: ThemeType = buildConfig().darkTheme

export default lightTheme
