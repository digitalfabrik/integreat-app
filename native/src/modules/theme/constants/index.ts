import buildConfig from '../../app/constants/buildConfig'
import { ThemeType } from 'build-configs/ThemeType'
export type { ThemeType }
export const lightTheme: ThemeType = buildConfig().lightTheme
export default lightTheme
