// @flow

import DatabaseConnector from '../DatabaseConnector'

describe('databaseConnector', () => {
  const existsMock = jest.fn()
  existsMock.mockReturnValueOnce({ then: jest.fn() })
  jest.mock('rn-fetch-blob', () => {
    return {
      DocumentDir: () => {},
      fetch: () => {},
      base64: () => {},
      android: () => {},
      ios: () => {},
      config: () => {},
      session: () => {},
      fs: () => {},
      wrap: () => {},
      polyfill: () => {},
      JSONStream: () => {}
    }
  })

  const dbCon = new DatabaseConnector()
  it('should call clear the city in the app settings', () => {
    expect(dbCon.getCitiesPath()).toContain('cities')
  })
})
