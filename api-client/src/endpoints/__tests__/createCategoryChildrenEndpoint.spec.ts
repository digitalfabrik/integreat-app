import { mocked } from 'ts-jest/utils'

import mapCategoryJson from '../../mapping/mapCategoryJson'
import CategoriesMapModelBuilder from '../../testing/CategoriesMapModelBuilder'
import createCategoryChildrenEndpoint from '../createCategoryChildrenEndpoint'

jest.mock('../../mapping/mapCategoryJson')

describe('createCategoryChildrenEndpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const baseUrl = 'https://example.com'
  const json = ['myFirstCategory', 'mySecondCategory']
  const params = {
    city: 'augsburg',
    language: 'fa',
    cityContentPath: '/augsburg/fa/erste-schritte/%d10%86%d9%82%d8%b4%d9%87-%d8%b4%d9%87%d8%b1/',
    depth: 1
  }
  const endpoint = createCategoryChildrenEndpoint(baseUrl)

  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toEqual(
      `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/children?depth=1&url=${params.cityContentPath}`
    )
  })

  it('should map params to url for root category', () => {
    expect(endpoint.mapParamsToUrl({ ...params, cityContentPath: '/augsburg/fa', depth: 0 })).toEqual(
      `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/children?depth=0`
    )
  })

  it('should map json to category', () => {
    const children = new CategoriesMapModelBuilder(params.city, params.language).build().toArray()

    mocked(mapCategoryJson)
      .mockImplementationOnce(() => children[0]!)
      .mockImplementationOnce(() => children[1]!)

    expect(endpoint.mapResponse(json, params)).toEqual(children.slice(0, 2))
    expect(mapCategoryJson).toHaveBeenCalledTimes(2)
    expect(mapCategoryJson).toHaveBeenCalledWith('myFirstCategory', `/${params.city}/${params.language}`)
    expect(mapCategoryJson).toHaveBeenCalledWith('mySecondCategory', `/${params.city}/${params.language}`)
  })
})
