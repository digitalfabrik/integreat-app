import { API_VERSION } from '../../constants'
import mapCategoryJson from '../../mapping/mapCategoryJson'
import createCategoryContentEndpoint from '../createCategoryContentEndpoint'
import CategoriesMapModelBuilder from '../testing/CategoriesMapModelBuilder'

jest.mock('../../mapping/mapCategoryJson')

describe('createCategoryContentEndpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const { mocked } = jest
  const baseUrl = 'https://example.com'
  const json = 'myJson'
  const params = {
    region: 'augsburg',
    language: 'fa',
    regionContentPath: '/augsburg/fa/erste-schritte/%d10%86%d9%82%d8%b4%d9%87-%d8%b4%d9%87%d8%b1/',
  }
  const endpoint = createCategoryContentEndpoint(baseUrl)

  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toBe(
      `${baseUrl}/api/${API_VERSION}/${params.region}/${params.language}/page/?url=${params.regionContentPath}`,
    )
  })

  it('should throw if using the endpoint for the root category', () => {
    expect(() =>
      endpoint.mapParamsToUrl({ ...params, regionContentPath: `/${params.region}/${params.language}` }),
    ).toThrow('This endpoint does not support the root category!')
  })

  it('should map json to category', () => {
    const category = new CategoriesMapModelBuilder(params.region, params.language).build().toArray()[1]!

    mocked(mapCategoryJson).mockImplementationOnce(() => category)

    expect(endpoint.mapResponse(json, params)).toEqual(category)
    expect(mapCategoryJson).toHaveBeenCalledTimes(1)
    expect(mapCategoryJson).toHaveBeenLastCalledWith(json, `/${params.region}/${params.language}`)
  })
})
