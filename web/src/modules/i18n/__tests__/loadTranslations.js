// @flow

import loadTranslations from '../loadTranslations'
import malteOverrideTranslations from '../__mocks__/malte-translations.json'

jest.mock(
  'translations/translations.json',
  () => require('../__mocks__/translations.json')
)

let mockBuildConfig
jest.mock('../../app/constants/buildConfig', () => {
  mockBuildConfig = jest.fn()
  return mockBuildConfig
})

describe('loadTranslations', () => {
  it('should correctly transform translations', () => {
    mockBuildConfig.mockImplementation(() => ({}))
    expect(loadTranslations()).toMatchSnapshot()
  })

  it('should correctly merge and transform translations', () => {
    mockBuildConfig.mockImplementation(() => ({ translationsOverride: malteOverrideTranslations }))
    expect(loadTranslations()).toMatchSnapshot()
  })
})
