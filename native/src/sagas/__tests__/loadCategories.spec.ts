import { runSaga } from 'redux-saga'

import { CategoryModel } from 'api-client'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'

import BlobUtil from '../../__mocks__/react-native-blob-util'
import DatabaseContext from '../../models/DatabaseContext'
import DatabaseConnector from '../../utils/DatabaseConnector'
import DefaultDataContainer from '../../utils/DefaultDataContainer'
import loadCategories from '../loadCategories'

let mockCategories: CategoryModel[]
jest.mock('api-client', () => {
  const actual = jest.requireActual('api-client')
  const city = 'augsburg'
  const language = 'de'
  return {
    ...actual,
    createCategoriesEndpoint: () => {
      const { EndpointBuilder } = require('api-client')

      const { default: CategoriesMapModelBuilder } = require('api-client/src/testing/CategoriesMapModelBuilder')

      mockCategories = new CategoriesMapModelBuilder(city, language, 2).build()
      return new EndpointBuilder('categories-mock')
        .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/augsburg/de')
        .withResponseOverride(mockCategories)
        .withMapper(() => undefined)
        .build()
    },
  }
})
describe('loadCategories', () => {
  beforeEach(() => {
    BlobUtil.fs._reset()
  })
  const city = 'augsburg'
  const language = 'de'
  const otherCategories = new CategoriesMapModelBuilder(city, language, 3).build()
  it('should fetch and set categories if categories are not available', async () => {
    const dataContainer = new DefaultDataContainer()
    await runSaga({}, loadCategories, city, language, dataContainer, false).toPromise()
    expect(await dataContainer.getCategoriesMap(city, language)).toStrictEqual(mockCategories)
  })
  it('should fetch and set categories if it should update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCategoriesMap(city, language, otherCategories)
    await runSaga({}, loadCategories, city, language, dataContainer, true).toPromise()
    expect(await dataContainer.getCategoriesMap(city, language)).toStrictEqual(mockCategories)
  })
  it('should use cached categories if they are available and should not update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCategoriesMap(city, language, otherCategories)
    await runSaga({}, loadCategories, city, language, dataContainer, false).toPromise()
    expect(await dataContainer.getCategoriesMap(city, language)).toBe(otherCategories)
  })
  it('should fetch categories if the stored JSON is malformatted', async () => {
    const context = new DatabaseContext('augsburg', 'de')
    const path = new DatabaseConnector().getContentPath('categories', context)
    await BlobUtil.fs.writeFile(path, '{ "i": { "am": "malformatted" } }', 'utf-8')
    const dataContainer = new DefaultDataContainer()
    const categories = await runSaga({}, loadCategories, city, language, dataContainer, false).toPromise()
    expect(categories).toBe(mockCategories)
  })
})
