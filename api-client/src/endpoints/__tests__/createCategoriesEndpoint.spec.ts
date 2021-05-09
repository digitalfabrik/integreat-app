// @flow

import createCategoriesEndpoint from '../createCategoriesEndpoint'
import mapCategoryJson from '../../mapping/mapCategoryJson'
import CategoriesMapModelBuilder from '../../testing/CategoriesMapModelBuilder'
import CategoryModel from '../../models/CategoryModel'
import moment from 'moment-timezone'
import CategoriesMapModel from '../../models/CategoriesMapModel'

jest.mock('../../mapping/mapCategoryJson')

describe('createCategoriesEndpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const baseUrl = 'https://example.com'
  const json = ['myFirstCategory', 'mySecondCategory', 'myThirdCategory']
  const params = { city: 'augsburg', language: 'fa' }
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

  const endpoint = createCategoriesEndpoint(baseUrl)

  it('should map params to url', () => {
    expect(endpoint.mapParamsToUrl(params)).toEqual(
      `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/pages`
    )
  })

  it('should map json to category', () => {
    const categories = new CategoriesMapModelBuilder(params.city, params.language).build().toArray().slice(0, 3)
    // $FlowFixMe mapCategoryJson is a mock
    mapCategoryJson.mockImplementation((json: string) => {
      switch (json) {
        case 'myFirstCategory':
          return categories[0]
        case 'mySecondCategory':
          return categories[1]
        case 'myThirdCategory':
          return categories[2]
      }
    })

    categories.push(rootCategory)
    const mapModel = new CategoriesMapModel(categories)
    expect(endpoint.mapResponse(json, params)).toEqual(mapModel)
    expect(mapCategoryJson).toHaveBeenCalledTimes(3)
    expect(mapCategoryJson).toHaveBeenCalledWith('myFirstCategory', basePath)
    expect(mapCategoryJson).toHaveBeenCalledWith('mySecondCategory', basePath)
    expect(mapCategoryJson).toHaveBeenCalledWith('myThirdCategory', basePath)
  })
})
