import createCategoryParentsEndpoint from '../createCategoryParentsEndpoint'
import mapCategoryJson from '../../mapping/mapCategoryJson'
import CategoriesMapModelBuilder from '../../testing/CategoriesMapModelBuilder'
import CategoryModel from '../../models/CategoryModel'
import moment from 'moment-timezone'
import mockCategoriesJson from '../../testing/mockCategoriesJson'

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
  const basePath = `/${params.city}/${params.language}`
  const rootCategory = new CategoryModel({
    root: true,
    path: basePath,
    title: params.city,
    parentPath: '',
    content: '',
    thumbnail: '',
    order: -1,
    availableLanguages: new Map(),
    lastUpdate: moment(0),
    hash: ''
  })
  const endpoint = createCategoryParentsEndpoint(baseUrl)
  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toEqual(
      `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/parents?&url=${params.cityContentPath}`
    )
  })
  it('should throw if using the endpoint for the root category', () => {
    expect(() => endpoint.mapParamsToUrl({ ...params, cityContentPath: `/${params.city}/${params.language}` })).toThrow(
      'This endpoint does not support the root category!'
    )
  })
  it('should map json to category', () => {
    const parents = new CategoriesMapModelBuilder(params.city, params.language).build().toArray().slice(0, 2)

    // @ts-ignore this mock in invalid
    ;((mapCategoryJson as unknown) as jest.Mock<
      (json: JsonCategoryType, basePath: string) => CategoryModel
    >).mockImplementation((json: string) => {
      if (json === 'myFirstCategory') {
        return parents[0]
      }

      return parents[1]
    })
    parents.push(rootCategory)
    expect(endpoint.mapResponse(json, params)).toEqual(parents)
    expect(mapCategoryJson).toHaveBeenCalledTimes(2)
    expect(mapCategoryJson).toHaveBeenCalledWith('myFirstCategory', `/${params.city}/${params.language}`)
    expect(mapCategoryJson).toHaveBeenCalledWith('mySecondCategory', `/${params.city}/${params.language}`)
  })
})
