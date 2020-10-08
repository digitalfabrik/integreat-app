// @flow

import loadLocales from '../loadLocales'
import malteOverrideLocales from '../__mocks__/malte-locales.json'

jest.mock(
  'locales/locales.json',
  () => require('../__mocks__/locales.json')
)

let mockBuildConfig
jest.mock('../../app/constants/buildConfig', () => {
  mockBuildConfig = jest.fn()
  return mockBuildConfig
})

describe('loadLocales', () => {
  it('should correctly transform locales', () => {
    mockBuildConfig.mockImplementation(() => ({}))
    expect(loadLocales()).toMatchSnapshot()
  })

  it('should correctly merge and transform locales', () => {
    mockBuildConfig.mockImplementation(() => ({ localesOverride: malteOverrideLocales }))
    expect(loadLocales()).toMatchSnapshot()
  })
})
