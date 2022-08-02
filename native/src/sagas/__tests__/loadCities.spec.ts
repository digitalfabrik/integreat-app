import { runSaga } from 'redux-saga'

import { CityModel } from 'api-client'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

import BlobUtil from '../../__mocks__/react-native-blob-util'
import DatabaseConnector from '../../utils/DatabaseConnector'
import DefaultDataContainer from '../../utils/DefaultDataContainer'
import loadCities from '../loadCities'

let mockCities: CityModel[]
jest.mock('api-client', () => {
  const actual = jest.requireActual('api-client')
  return {
    ...actual,
    createCitiesEndpoint: () => {
      const { EndpointBuilder } = require('api-client')

      const { default: CityModelBuilder } = require('api-client/src/testing/CityModelBuilder')

      mockCities = new CityModelBuilder(1).build()
      return new EndpointBuilder('cities-mock')
        .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/sites')
        .withResponseOverride(mockCities)
        .withMapper(() => undefined)
        .build()
    },
  }
})
describe('loadCities', () => {
  beforeEach(() => {
    BlobUtil.fs._reset()
  })
  const otherCities = new CityModelBuilder(2).build()
  it('should fetch and set cities if cities are not available', async () => {
    const dataContainer = new DefaultDataContainer()
    await runSaga({}, loadCities, dataContainer, false).toPromise()
    expect(await dataContainer.getCities()).toStrictEqual(mockCities)
  })
  it('should fetch and set cities if it should update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCities(otherCities)
    await runSaga({}, loadCities, dataContainer, true).toPromise()
    expect(await dataContainer.getCities()).toStrictEqual(mockCities)
  })
  it('should use cached cities if they are available and should not update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCities(otherCities)
    await runSaga({}, loadCities, dataContainer, false).toPromise()
    expect(await dataContainer.getCities()).toBe(otherCities)
  })
  it('should fetch cities if the stored JSON is malformatted', async () => {
    const path = new DatabaseConnector().getCitiesPath()
    await BlobUtil.fs.writeFile(path, '{ "i": { "am": "malformatted" } }', 'utf-8')
    const dataContainer = new DefaultDataContainer()
    const cities = await runSaga({}, loadCities, dataContainer, false).toPromise()
    expect(cities).toBe(mockCities)
  })
})
