import languagesMapper from '../languages'
import LanguageModel from '../../models/LanguageModel'

jest.unmock('../languages')

describe('languages', () => {
  const languagesJson = [
    {
      code: 'en',
      native_name: 'English'
    },
    {
      code: 'de',
      native_name: 'Deutsch'
    }
  ]

  it('should map fetched data to models', () => {
    const languageModels = languagesMapper(languagesJson)
    expect(languageModels).toEqual([
      new LanguageModel('de', 'Deutsch'),
      new LanguageModel('en', 'English')
    ])
  })
})
