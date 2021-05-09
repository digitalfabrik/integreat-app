import createCategoryContentEndpoint from '../createCategoryContentEndpoint'
import mapCategoryJson from '../../mapping/mapCategoryJson'
import CategoriesMapModelBuilder from '../../testing/CategoriesMapModelBuilder'
jest.mock('../../mapping/mapCategoryJson')
describe('createCategoryContentEndpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const baseUrl = 'https://example.com'
  const json = 'myJson'
  const params = {
    city: 'augsburg',
    language: 'fa',
    cityContentPath: '/augsburg/fa/erste-schritte/%d10%86%d9%82%d8%b4%d9%87-%d8%b4%d9%87%d8%b1/'
  }
  const endpoint = createCategoryContentEndpoint(baseUrl)
  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toEqual(
      `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/post?&url=${params.cityContentPath}`
    )
  })
  it('should throw if using the endpoint for the root category', () => {
    expect(() => endpoint.mapParamsToUrl({ ...params, cityContentPath: `/${params.city}/${params.language}` })).toThrow(
      'This endpoint does not support the root category!'
    )
  })
  it('should map json to category', () => {
    const category = new CategoriesMapModelBuilder(params.city, params.language).build().toArray()[1]
    // $FlowFixMe mapCategoryJson is a mock
    mapCategoryJson.mockImplementationOnce(() => category)
    expect(endpoint.mapResponse(json, params)).toEqual(category)
    expect(mapCategoryJson).toHaveBeenCalledTimes(1)
    expect(mapCategoryJson).toHaveBeenLastCalledWith(json, `/${params.city}/${params.language}`)
  })
})