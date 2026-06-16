import { CATEGORIES_ROUTE, PLACES_ROUTE, SEARCH_ROUTE } from '../index.js'
import { parseQueryParams, queryStringFromRouteInformation, toQueryParams } from '../query.js'

describe('queryStringFromRouteInformation', () => {
  it('should create places query string', () => {
    const routeInformation = {
      route: PLACES_ROUTE,
      languageCode: 'de',
      regionCode: 'augsburg',
    }

    expect(queryStringFromRouteInformation(routeInformation)).toBeUndefined()
    expect(queryStringFromRouteInformation({ ...routeInformation, slug: 'test-slug' })).toBeUndefined()
    expect(queryStringFromRouteInformation({ ...routeInformation, multiPlace: 1 })).toBe('?multiplace=1')
    expect(queryStringFromRouteInformation({ ...routeInformation, slug: 'test-slug', multiPlace: 1, zoom: 10 })).toBe(
      '?multiplace=1&zoom=10',
    )
    expect(
      queryStringFromRouteInformation({
        ...routeInformation,
        slug: 'test-slug',
        multiPlace: 1,
        zoom: 10,
        placeCategoryId: 7,
      }),
    ).toBe('?multiplace=1&category=7&zoom=10')
  })

  it('should create search query string', () => {
    const routeInformation = {
      route: SEARCH_ROUTE,
      languageCode: 'de',
      regionCode: 'augsburg',
    }

    expect(queryStringFromRouteInformation({ ...routeInformation })).toBeUndefined()
    expect(queryStringFromRouteInformation({ ...routeInformation, searchText: 'test query' })).toBe('?query=test+query')
  })

  it('should create chat query string', () => {
    const routeInformation = {
      route: CATEGORIES_ROUTE,
      languageCode: 'de',
      regionCode: 'augsburg',
      regionContentPath: '/augsburg/de',
    }

    expect(queryStringFromRouteInformation({ ...routeInformation })).toBeUndefined()
    expect(queryStringFromRouteInformation({ ...routeInformation, chat: true })).toBe('?chat=true')
  })
})

describe('parse query params', () => {
  it('should get place query params', () => {
    expect(parseQueryParams(new URLSearchParams(''))).toEqual({})
    expect(parseQueryParams(new URLSearchParams('?multiplace=3'))).toEqual({ multiPlace: 3 })
    expect(parseQueryParams(new URLSearchParams('?multiplace=1&category=7&zoom=10'))).toEqual({
      multiPlace: 1,
      zoom: 10,
      placeCategoryId: 7,
    })
  })

  it('should get search query params', () => {
    expect(parseQueryParams(new URLSearchParams(''))).toEqual({})
    expect(parseQueryParams(new URLSearchParams('?query=my custom query'))).toEqual({ searchText: 'my custom query' })
  })

  it('should get chat query params', () => {
    expect(parseQueryParams(new URLSearchParams(''))).toEqual({})
    expect(parseQueryParams(new URLSearchParams('?chat=true'))).toEqual({ chat: true })
  })
})

describe('toQueryParams', () => {
  it('should get place query params', () => {
    expect(toQueryParams({})).toEqual(new URLSearchParams(''))
    expect(toQueryParams({ multiPlace: 1 })).toEqual(new URLSearchParams('?multiplace=1'))
    expect(
      toQueryParams({
        multiPlace: 1,
        zoom: 10,
        placeCategoryId: 7,
      }),
    ).toEqual(new URLSearchParams('?multiplace=1&category=7&zoom=10'))
  })

  it('should get search query params', () => {
    expect(toQueryParams({ searchText: 'my custom query' })).toEqual(new URLSearchParams('?query=my custom query'))
    expect(toQueryParams({ searchText: '' })).toEqual(new URLSearchParams(''))
  })

  it('should get chat query params', () => {
    expect(toQueryParams({ chat: true })).toEqual(new URLSearchParams('?chat=true'))
    expect(toQueryParams({ chat: undefined })).toEqual(new URLSearchParams(''))
  })
})
