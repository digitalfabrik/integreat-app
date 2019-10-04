// @flow

import { runSaga } from 'redux-saga'
import loadCategories from '../loadCategories'
import DefaultDataContainer from '../../DefaultDataContainer'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import CategoriesMapModelBuilder from '../../../../testing/builder/CategoriesMapModelBuilder'

let mockCategories
jest.mock('rn-fetch-blob')
jest.mock('@integreat-app/integreat-api-client',
  () => {
    const actual = jest.requireActual('@integreat-app/integreat-api-client')
    return {
      ...actual,
      createCategoriesEndpoint: () => {
        const { EndpointBuilder } = require('@integreat-app/integreat-api-client')
        const { default: CategoriesMapModelBuilder } = require('../../../../testing/builder/CategoriesMapModelBuilder')

        mockCategories = new CategoriesMapModelBuilder(2).build()
        return new EndpointBuilder('categories-mock')
          .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/augsburg/de')
          .withResponseOverride(mockCategories)
          .withMapper(() => { })
          .build()
      }
    }
  })

describe('loadCategories', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const otherCategories = new CategoriesMapModelBuilder(3).build()

  const city = 'augsburg'
  const language = 'de'

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
})
