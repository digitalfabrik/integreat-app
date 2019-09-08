// @flow

import DatabaseContext from '../DatabaseContext'

describe('DatabaseContext', () => {
  describe('sameCityAs', () => {
    it('should return false if the cityCode is null', () => {
      const databaseContext = new DatabaseContext('testCity', 'de')
      expect(databaseContext.sameCityAs(new DatabaseContext(null, 'en'))).toBe(false)
    })
    it('should return true if the cities are equal', () => {
      const databaseContext = new DatabaseContext('testCity', 'de')
      expect(databaseContext.sameCityAs(new DatabaseContext('testCity', 'en'))).toBe(true)
    })
    it('should return false if the cities are not equal', () => {
      const databaseContext = new DatabaseContext('testCity', 'de')
      expect(databaseContext.sameCityAs(new DatabaseContext('anotherTestCity', 'en'))).toBe(false)
    })
  })
  describe('sameLanguageAs', () => {
    it('should return false if the languageCode is null', () => {
      const databaseContext = new DatabaseContext('testCity', 'de')
      expect(databaseContext.sameLanguageAs(new DatabaseContext('testCity', null))).toBe(false)
    })
    it('should return true if the languages are equal', () => {
      const databaseContext = new DatabaseContext('testCity', 'de')
      expect(databaseContext.sameLanguageAs(new DatabaseContext('testCity', 'de'))).toBe(true)
    })
    it('should return false if the cities are not equal', () => {
      const databaseContext = new DatabaseContext('testCity', 'de')
      expect(databaseContext.sameLanguageAs(new DatabaseContext('testCity', 'en'))).toBe(false)
    })
  })
})
