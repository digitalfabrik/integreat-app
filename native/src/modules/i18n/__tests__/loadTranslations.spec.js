// @flow

import loadTranslations from '../loadTranslations'
import malteOverrideTranslations from '../__mocks__/malte-translations.json'
import buildConfig from '../../app/constants/buildConfig'

jest.mock(
  'translations/translations.json',
  () => require('../__mocks__/translations.json')
)

describe('loadTranslations', () => {
  it('should correctly transform translations', () => {
    expect(loadTranslations()).toMatchSnapshot()
  })

  it('should correctly merge and transform translations', () => {
    const previousBuildConfig = buildConfig()
    // $FlowFixMe flow is not aware that buildConfig is a mock funciton
    buildConfig.mockImplementation(() => ({ ...previousBuildConfig, translationsOverride: malteOverrideTranslations }))
    expect(loadTranslations()).toMatchSnapshot()
  })
})
