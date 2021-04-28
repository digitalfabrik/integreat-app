// @flow

import createCategoryParentsEndpoint from '../createCategoryParentsEndpoint'
import mapCategoryJson from '../../mapping/mapCategoryJson'
import CategoriesMapModelBuilder from '../../testing/CategoriesMapModelBuilder'

jest.mock('../../mapping/mapCategoryJson')

describe('createCategoryParentsEndpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const baseUrl = 'https://example.com'
  const json = ['myFirstCategory', 'mySecondCategory']
  const params = {
    city: 'augsburg',
    language: 'fa',
    cityContentPath: '/augsburg/fa/erste-schritte/%d10%86%d9%82%d8%b4%d9%87-%d8%b4%d9%87%d8%b1/'
  }

  const endpoint = createCategoryParentsEndpoint(baseUrl)

  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toEqual(
      `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/parents?&url=${params.cityContentPath}`
    )
  })

  it('should map json to category', () => {
    const parents = new CategoriesMapModelBuilder(params.city, params.language).build().toArray()
    // $FlowFixMe mapCategoryJson is a mock
    mapCategoryJson.mockImplementation((json: string) => {
      if (json === 'myFirstCategory') {
        return parents[0]
      }
      return parents[1]
    })

    expect(endpoint.mapResponse(json, params)).toEqual(parents.slice(0, 2))
    expect(mapCategoryJson).toHaveBeenCalledTimes(2)
    expect(mapCategoryJson).toHaveBeenCalledWith('myFirstCategory', `/${params.city}/${params.language}`)
    expect(mapCategoryJson).toHaveBeenCalledWith('mySecondCategory', `/${params.city}/${params.language}`)
  })
})
