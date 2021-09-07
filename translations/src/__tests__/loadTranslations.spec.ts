import { testOverrideTranslations } from '../__mocks__/loadTranslations'
import loadTranslations from '../loadTranslations'

jest.mock('../../translations.json', () => require('../__mocks__/loadTranslations').testTranslations)
describe('loadTranslations', () => {
  it('should correctly transform translations', () => {
    expect(loadTranslations()).toMatchSnapshot()
  })
  it('should correctly merge and transform translations', () => {
    expect(loadTranslations(testOverrideTranslations)).toMatchSnapshot()
  })
})
