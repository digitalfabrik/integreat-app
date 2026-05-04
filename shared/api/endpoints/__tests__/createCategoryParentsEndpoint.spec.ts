import { DateTime } from 'luxon'

import { API_VERSION } from '../../constants'
import mapCategoryJson from '../../mapping/mapCategoryJson'
import CategoryModel from '../../models/CategoryModel'
import createCategoryParentsEndpoint from '../createCategoryParentsEndpoint'
import CategoriesMapModelBuilder from '../testing/CategoriesMapModelBuilder'

jest.mock('../../mapping/mapCategoryJson')

describe('createCategoryParentsEndpoint', () => {
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
  }
  const basePath = `/${params.region}/${params.language}`
  const rootCategory = new CategoryModel({
    root: true,
    path: basePath,
    title: params.region,
    parentPath: '',
    content: '',
    thumbnail: '',
    order: -1,
    availableLanguages: {},
    lastUpdate: DateTime.fromMillis(0),
    organization: null,
    embeddedOffers: [],
  })
  const endpoint = createCategoryParentsEndpoint(baseUrl)

  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toBe(
      `${baseUrl}/api/${API_VERSION}/${params.region}/${params.language}/parents/?url=${params.regionContentPath}`,
    )
  })

  it('should throw if using the endpoint for the root category', () => {
    expect(() =>
      endpoint.mapParamsToUrl({ ...params, regionContentPath: `/${params.region}/${params.language}` }),
    ).toThrow('This endpoint does not support the root category!')
  })

  it('should map json to category', () => {
    const parents = new CategoriesMapModelBuilder(params.region, params.language).build().toArray().slice(0, 2)

    mocked(mapCategoryJson)
      .mockImplementationOnce(() => parents[0]!)
      .mockImplementationOnce(() => parents[1]!)

    parents.push(rootCategory)
    expect(endpoint.mapResponse(json, params)).toEqual(parents)
    expect(mapCategoryJson).toHaveBeenCalledTimes(2)
    expect(mapCategoryJson).toHaveBeenCalledWith('myFirstCategory', `/${params.region}/${params.language}`)
    expect(mapCategoryJson).toHaveBeenCalledWith('mySecondCategory', `/${params.region}/${params.language}`)
  })
})
