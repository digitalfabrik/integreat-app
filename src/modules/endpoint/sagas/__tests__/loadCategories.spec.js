// @flow

import { CategoryModel, CategoriesMapModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import { runSaga } from 'redux-saga'
import loadCategories from '../loadCategories'
import DefaultDataContainer from '../../DefaultDataContainer'

jest.mock('@integreat-app/integreat-api-client/endpoints/createCategoriesEndpoint')

describe('loadCategories', () => {
  const rootCategory = new CategoryModel({
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

  const oldCategoriesMap = new CategoriesMapModel([rootCategory])

  const categoryModels = [
    rootCategory,
    new CategoryModel({
      id: 3650,
      path: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '',
      parentPath: '/augsburg/de',
      order: 75,
      availableLanguages: new Map([['en', '4361'], ['ar', '4367'], ['fa', '4368']]),
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
    })
  ]

  const newCategoriesMap = new CategoriesMapModel(categoryModels)
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
    const result = await runSaga({}, loadCategories, city, language, dataContainer, true)

    expect(result).toStrictEqual(newCategoriesMap)
    expect(setCategoriesMap).toHaveBeenCalledTimes(1)
    expect(setCategoriesMap).toHaveBeenCalledWith(city, language, newCategoriesMap)
  })

  it('should use cached categories if categories are available and it should not update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCategoriesMap(city, language, newCategoriesMap)
    const setCategoriesMap = jest.fn()
    dataContainer.setCategoriesMap = setCategoriesMap
    const result = await runSaga({}, loadCategories, city, language, dataContainer, false)

    expect(result).toStrictEqual(newCategoriesMap)
    expect(setCategoriesMap).not.toHaveBeenCalled()
  })
})
