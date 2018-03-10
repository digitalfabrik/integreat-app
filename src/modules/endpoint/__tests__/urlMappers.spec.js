import { categoriesUrlMapper, disclaimerUrlMapper, eventsUrlMapper,
  extrasUrlMapper, languagesUrlMapper, locationUrlMapper, sprungbrettUrlMapper } from '../urlMappers'

describe('urlMappers', () => {
  const params = {location: 'augsburg', language: 'de', url: 'sprungbrett_url'}

  it('should map params to disclaimer url', () => {
    expect(disclaimerUrlMapper(params)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v0/modified_content/disclaimer' +
      '?since=1970-01-01T00:00:00Z'
    )
  })

  it('should map params to categories url', () => {
    expect(categoriesUrlMapper(params)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v0/modified_content/pages?since=1970-01-01T00:00:00Z'
    )
  })

  it('should map params to events url', () => {
    expect(eventsUrlMapper(params)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v0/modified_content/events' +
      '?since=1970-01-01T00:00:00Z'
    )
  })

  it('should map params to extras url', () => {
    expect(extrasUrlMapper(params)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v3/extras'
    )
  })

  it('should map params to languages url', () => {
    expect(languagesUrlMapper(params)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v0/languages/wpml'
    )
  })

  it('should map params to locations url', () => {
    expect(locationUrlMapper()).toEqual('https://cms.integreat-app.de/wp-json/extensions/v1/multisites')
  })

  it('should map params to sprungbrett url', () => {
    expect(sprungbrettUrlMapper(params)).toEqual(
      'sprungbrett_url'
    )
  })
})
