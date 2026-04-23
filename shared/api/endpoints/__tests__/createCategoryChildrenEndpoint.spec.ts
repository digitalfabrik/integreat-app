import { API_VERSION } from '../../constants'
import mapCategoryJson from '../../mapping/mapCategoryJson'
import createCategoryChildrenEndpoint from '../createCategoryChildrenEndpoint'
import CategoriesMapModelBuilder from '../testing/CategoriesMapModelBuilder'

jest.mock('../../mapping/mapCategoryJson')

describe('createCategoryChildrenEndpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const { mocked } = jest
  const baseUrl = 'https://example.com'
  const json = ['myFirstCategory', 'mySecondCategory']
  const params = {
    region: 'augsburg',
    language: 'fa',
    regionContentPath: '/augsburg/fa/erste-schritte/%d10%86%d9%82%d8%b4%d9%87-%d8%b4%d9%87%d8%b1/',
    depth: 1,
  }
  const endpoint = createCategoryChildrenEndpoint(baseUrl)

  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toBe(
      `${baseUrl}/api/${API_VERSION}/${params.region}/${params.language}/children/?depth=1&url=${params.regionContentPath}`,
    )
  })

  it('should map params to url for root category', () => {
    expect(endpoint.mapParamsToUrl({ ...params, regionContentPath: '/augsburg/fa', depth: 0 })).toBe(
      `${baseUrl}/api/${API_VERSION}/${params.region}/${params.language}/children/?depth=0`,
    )
  })

  it('should map json to category', () => {
    const children = new CategoriesMapModelBuilder(params.region, params.language).build().toArray()

    mocked(mapCategoryJson)
      .mockImplementationOnce(() => children[0]!)
      .mockImplementationOnce(() => children[1]!)

    expect(endpoint.mapResponse(json, params)).toEqual(children.slice(0, 2))
    expect(mapCategoryJson).toHaveBeenCalledTimes(2)
    expect(mapCategoryJson).toHaveBeenCalledWith('myFirstCategory', `/${params.region}/${params.language}`)
    expect(mapCategoryJson).toHaveBeenCalledWith('mySecondCategory', `/${params.region}/${params.language}`)
  })
})
