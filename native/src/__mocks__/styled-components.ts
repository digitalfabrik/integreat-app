import buildConfig from '../constants/buildConfig'

const realModule = jest.requireActual('styled-components')

const useTheme = () => buildConfig().legacyLightTheme

module.exports = {
  ...realModule,
  useTheme,
}
