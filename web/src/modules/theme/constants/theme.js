// @flow

import buildConfig from '../../app/constants/buildConfig'
import type { ThemeType } from '../../app/constants/buildConfig'

export type { ThemeType }

export const brightTheme: ThemeType = buildConfig().lightTheme

export const darkTheme: ThemeType = buildConfig().darkTheme

export default brightTheme
