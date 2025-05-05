import { CATEGORIES_ROUTE, POIS_ROUTE, SEARCH_ROUTE } from '../index'
import { parseQueryParams, queryStringFromRouteInformation, SEARCH_QUERY_KEY, toQueryParams } from '../query'

describe('queryStringFromRouteInformation', () => {
  it('should create pois query string', () => {
    const routeInformation = {
      route: POIS_ROUTE,
      languageCode: 'de',
      cityCode: 'augsburg',
    }

    expect(queryStringFromRouteInformation(routeInformation)).toBeUndefined()
    expect(queryStringFromRouteInformation({ ...routeInformation, slug: 'test-slug' })).toBeUndefined()
    expect(queryStringFromRouteInformation({ ...routeInformation, multipoi: 1 })).toBe('?multipoi=1')
    expect(queryStringFromRouteInformation({ ...routeInformation, slug: 'test-slug', multipoi: 1, zoom: 10 })).toBe(
      '?multipoi=1&zoom=10',
    )
    expect(
      queryStringFromRouteInformation({
        ...routeInformation,
        slug: 'test-slug',
        multipoi: 1,
        zoom: 10,
        poiCategoryId: 7,
      }),
    ).toBe('?multipoi=1&category=7&zoom=10')
  })

  it('should create search query string', () => {
    const routeInformation = {
      route: SEARCH_ROUTE,
      languageCode: 'de',
      cityCode: 'augsburg',
    }

    expect(queryStringFromRouteInformation({ ...routeInformation })).toBeUndefined()
    expect(queryStringFromRouteInformation({ ...routeInformation, searchText: 'test query' })).toBe('?query=test+query')
  })

  it('should create chat query string', () => {
    const routeInformation = {
      route: CATEGORIES_ROUTE,
      languageCode: 'de',
      cityCode: 'augsburg',
      cityContentPath: '/augsburg/de',
    }

    expect(queryStringFromRouteInformation({ ...routeInformation })).toBeUndefined()
    expect(queryStringFromRouteInformation({ ...routeInformation, chat: true })).toBe('?chat=true')
  })
})

describe('parse query params', () => {
  it('should get poi query params', () => {
    expect(parseQueryParams(new URLSearchParams(''))).toEqual({})
    expect(parseQueryParams(new URLSearchParams('?multipoi=3'))).toEqual({ multipoi: 3 })
    expect(parseQueryParams(new URLSearchParams('?multipoi=1&category=7&zoom=10'))).toEqual({
      multipoi: 1,
      zoom: 10,
      poiCategoryId: 7,
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
  it('should get poi query params', () => {
    expect(toQueryParams({})).toEqual(new URLSearchParams(''))
    expect(toQueryParams({ multipoi: 1 })).toEqual(new URLSearchParams('?multipoi=1'))
    expect(
      toQueryParams({
        multipoi: 1,
        zoom: 10,
        poiCategoryId: 7,
      }),
    ).toEqual(new URLSearchParams('?multipoi=1&category=7&zoom=10'))
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
