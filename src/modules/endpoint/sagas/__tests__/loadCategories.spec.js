// @flow

import { CategoryModel, CategoriesMapModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import { runSaga } from 'redux-saga'
import loadCategories from '../loadCategories'
import DefaultDataContainer from '../../DefaultDataContainer'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'

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
    RNFetchBlob.fs._reset()
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

  it('should fetch and set categories if categories are not available', async () => {
    const dataContainer = new DefaultDataContainer()

    await runSaga({}, loadCategories, city, language, dataContainer, false).toPromise()

    expect(await dataContainer.getCategoriesMap(city, language)).toStrictEqual(newCategoriesMap)
  })

  it('should fetch and set categories if it should update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCategoriesMap(city, language, oldCategoriesMap)

    await runSaga({}, loadCategories, city, language, dataContainer, true).toPromise()

    expect(await dataContainer.getCategoriesMap(city, language)).toStrictEqual(newCategoriesMap)
  })

  it('should use cached categories if they are available and should not update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCategoriesMap(city, language, oldCategoriesMap)

    await runSaga({}, loadCategories, city, language, dataContainer, false).toPromise()

    expect(await dataContainer.getCategoriesMap(city, language)).toBe(oldCategoriesMap)
  })
})
