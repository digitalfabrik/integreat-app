// eslint-disable-next-line import/no-import-module-exports
import buildConfig from '../../constants/buildConfig'

const realModule = jest.requireActual('styled-components/native')

const useTheme = () => buildConfig().lightTheme

module.exports = {
  __esModule: true,
  ...realModule,
  useTheme,
}
