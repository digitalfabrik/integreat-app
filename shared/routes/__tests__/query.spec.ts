import { POIS_ROUTE, SEARCH_ROUTE } from '../index'
import { getSearchParams, queryFromRouteInformation, SEARCH_QUERY_KEY, toSearchParams } from '../query'

describe('queryFromRouteInformation', () => {
  it('should create pois query', () => {
    const routeInformation = {
      route: POIS_ROUTE,
      languageCode: 'de',
      cityCode: 'augsburg',
    }

    expect(queryFromRouteInformation(routeInformation)).toBeUndefined()
    expect(queryFromRouteInformation({ ...routeInformation, slug: 'test-slug' })).toBeUndefined()
    expect(queryFromRouteInformation({ ...routeInformation, multipoi: 1 })).toBe('?multipoi=1')
    expect(queryFromRouteInformation({ ...routeInformation, slug: 'test-slug', multipoi: 1, zoom: 10 })).toBe(
      '?multipoi=1&zoom=10',
    )
    expect(
      queryFromRouteInformation({ ...routeInformation, slug: 'test-slug', multipoi: 1, zoom: 10, poiCategoryId: 7 }),
    ).toBe('?multipoi=1&category=7&zoom=10')
  })

  it('should create search query', () => {
    const routeInformation = {
      route: SEARCH_ROUTE,
      languageCode: 'de',
      cityCode: 'augsburg',
    }

    expect(queryFromRouteInformation({ ...routeInformation })).toBeUndefined()
    expect(queryFromRouteInformation({ ...routeInformation, searchText: 'test query' })).toBe('?query=test+query')
  })
})

describe('getSearchParams', () => {
  it('should get poi search params', () => {
    expect(getSearchParams(new URLSearchParams(''))).toEqual({})
    expect(getSearchParams(new URLSearchParams('?multipoi=3'))).toEqual({ multipoi: 3 })
    expect(getSearchParams(new URLSearchParams('?multipoi=1&category=7&zoom=10'))).toEqual({
      multipoi: 1,
      zoom: 10,
      poiCategoryId: 7,
    })
  })

  it('should get search search params', () => {
    expect(getSearchParams(new URLSearchParams(''))).toEqual({})
    expect(getSearchParams(new URLSearchParams('?query=my custom query'))).toEqual({ searchText: 'my custom query' })
  })
})

describe('toSearchParams', () => {
  it('should get poi search params', () => {
    expect(toSearchParams({})).toEqual(new URLSearchParams(''))
    expect(
      toSearchParams({
        multipoi: 1,
      }),
    ).toEqual(new URLSearchParams('?multipoi=1'))
    expect(
      toSearchParams({
        multipoi: 1,
        zoom: 10,
        poiCategoryId: 7,
      }),
    ).toEqual(new URLSearchParams('?multipoi=1&category=7&zoom=10'))
  })

  it('should get search search params', () => {
    expect(
      toSearchParams({
        searchText: 'my custom query',
      }),
    ).toEqual(new URLSearchParams('?query=my custom query'))
    expect(
      toSearchParams({
        searchText: '',
      }),
    ).toEqual(new URLSearchParams(''))
  })
})
