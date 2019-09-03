// @flow

import { CategoryModel, CategoriesMapModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import { runSaga } from 'redux-saga'
import loadCategories from '../loadCategories'
import DefaultDataContainer from '../../DefaultDataContainer'

jest.mock('rn-fetch-blob')
jest.mock('@integreat-app/integreat-api-client/endpoints/createCategoriesEndpoint',
  () => () => {
    const { CategoryModel, CategoriesMapModel, EndpointBuilder } = require('@integreat-app/integreat-api-client')
    const moment = require('moment-timezone')

    return new EndpointBuilder('categories-mock')
      .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/augsburg/de')
      .withResponseOverride(new CategoriesMapModel([new CategoryModel({
        path: '/augsburg/de',
        title: '4 Issues schafft man immer!',
        content: '',
        order: -1,
        availableLanguages: new Map(),
        thumbnail: 'Integreat.jpg',
        parentPath: '',
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
      })]))
      .withMapper(() => { })
      .build()
  }
)

describe('loadCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const oldCategory = new CategoryModel({
    id: 0,
    path: '/augsburg/de',
    title: 'augsburg',
    content: '',
    order: -1,
    availableLanguages: new Map(),
    thumbnail: 'no_thumbnail',
    parentPath: '',
    lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
  })

  const oldCategoriesMap = new CategoriesMapModel([oldCategory])

  const newCategory = new CategoryModel({
    path: '/augsburg/de',
    title: '4 Issues schafft man immer!',
    content: '',
    order: -1,
    availableLanguages: new Map(),
    thumbnail: 'Integreat.jpg',
    parentPath: '',
    lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
  })

  const newCategoriesMap = new CategoriesMapModel([newCategory])
  const city = 'augsburg'
  const language = 'de'

  it('should fetch categories if categories are not available', async () => {
    const dataContainer = new DefaultDataContainer()
    const setCategoriesMap = jest.fn()
    dataContainer.setCategoriesMap = setCategoriesMap
    const result = await runSaga({}, loadCategories, city, language, dataContainer, false).toPromise()

    expect(result).toStrictEqual(newCategoriesMap)
    expect(setCategoriesMap).toHaveBeenCalledTimes(1)
    expect(setCategoriesMap).toHaveBeenCalledWith(city, language, newCategoriesMap)
  })

  it('should fetch categories if it should update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCategoriesMap(city, language, oldCategoriesMap)
    const setCategoriesMap = jest.fn()
    dataContainer.setCategoriesMap = setCategoriesMap
    const result = await runSaga({}, loadCategories, city, language, dataContainer, true).toPromise()

    expect(result).toStrictEqual(newCategoriesMap)
    expect(setCategoriesMap).toHaveBeenCalledTimes(1)
    expect(setCategoriesMap).toHaveBeenCalledWith(city, language, newCategoriesMap)
  })

  it('should use cached categories if categories are available and it should not update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCategoriesMap(city, language, newCategoriesMap)
    const setCategoriesMap = jest.fn()
    dataContainer.setCategoriesMap = setCategoriesMap
    const result = await runSaga({}, loadCategories, city, language, dataContainer, false).toPromise()

    expect(result).toStrictEqual(newCategoriesMap)
    expect(setCategoriesMap).not.toHaveBeenCalled()
  })
})
