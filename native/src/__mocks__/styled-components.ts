import buildConfig from '../constants/buildConfig'

const realModule = jest.requireActual('styled-components')

const useTheme = () => buildConfig().lightTheme

module.exports = {
  ...realModule,
  useTheme
}
