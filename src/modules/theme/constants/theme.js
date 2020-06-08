// @flow

import buildConfig from '../../app/constants/buildConfig'
import type { ThemeType } from '../../../../build-configs/themes/ThemeType'

export type { ThemeType }

export const brightTheme: ThemeType = buildConfig.theme

export const darkTheme: ThemeType = buildConfig.darkTheme

export default brightTheme
