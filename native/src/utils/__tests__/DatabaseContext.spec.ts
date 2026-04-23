import DatabaseContext from '../../models/DatabaseContext'

describe('DatabaseContext', () => {
  describe('sameRegionAs', () => {
    it('should return false if the regionCode is null', () => {
      const databaseContext = new DatabaseContext('testRegion', 'de')
      expect(databaseContext.sameRegionAs(new DatabaseContext(undefined, 'en'))).toBe(false)
    })
    it('should return true if the regions are equal', () => {
      const databaseContext = new DatabaseContext('testRegion', 'de')
      expect(databaseContext.sameRegionAs(new DatabaseContext('testRegion', 'en'))).toBe(true)
    })
    it('should return false if the regions are not equal', () => {
      const databaseContext = new DatabaseContext('testRegion', 'de')
      expect(databaseContext.sameRegionAs(new DatabaseContext('anotherTestRegion', 'en'))).toBe(false)
    })
    it('should return false if the context is null', () => {
      const databaseContext = new DatabaseContext('testRegion', 'de')
      expect(databaseContext.sameRegionAs(null)).toBe(false)
    })
  })
  describe('sameLanguageAs', () => {
    it('should return false if the languageCode is null', () => {
      const databaseContext = new DatabaseContext('testRegion', 'de')
      expect(databaseContext.sameLanguageAs(new DatabaseContext('testRegion'))).toBe(false)
    })
    it('should return true if the languages are equal', () => {
      const databaseContext = new DatabaseContext('testRegion', 'de')
      expect(databaseContext.sameLanguageAs(new DatabaseContext('testRegion', 'de'))).toBe(true)
    })
    it('should return false if the languages are not equal', () => {
      const databaseContext = new DatabaseContext('testRegion', 'de')
      expect(databaseContext.sameLanguageAs(new DatabaseContext('testRegion', 'en'))).toBe(false)
    })
    it('should return false if the context is null', () => {
      const databaseContext = new DatabaseContext('testRegion', 'de')
      expect(databaseContext.sameLanguageAs(null)).toBe(false)
    })
  })
  describe('equals', () => {
    it('should return true if context is equal', () => {
      const databaseContext = new DatabaseContext('testRegion', 'de')
      const anotherDatabaseContext = new DatabaseContext('testRegion', 'de')
      expect(databaseContext.equals(anotherDatabaseContext)).toBe(true)
    })
  })
})
