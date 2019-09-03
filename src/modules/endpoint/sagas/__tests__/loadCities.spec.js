// @flow

import { CityModel } from '@integreat-app/integreat-api-client'
import { runSaga } from 'redux-saga'
import DefaultDataContainer from '../../DefaultDataContainer'
import loadCities from '../loadCities'

jest.mock('rn-fetch-blob')
jest.mock('@integreat-app/integreat-api-client/endpoints/createCitiesEndpoint',
  () => () => {
    const { CityModel, EndpointBuilder } = require('@integreat-app/integreat-api-client')

    return new EndpointBuilder('cities-mock')
      .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/sites')
      .withResponseOverride([new CityModel({
        name: 'Stadt Augsburg',
        code: 'augsburg',
        live: true,
        eventsEnabled: true,
        extrasEnabled: true,
        sortingName: 'Augsburg',
        prefix: 'Stadt'
      })])
      .withMapper(() => { })
      .build()
  }
)

describe('loadCities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const oldCities = [
    new CityModel({
      name: 'Oldtown',
      code: 'oldtown',
      live: false,
      eventsEnabled: true,
      extrasEnabled: true,
      sortingName: 'Oldtown',
      prefix: 'GoT'
    })
  ]

  const newCities = [
    new CityModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: true,
      sortingName: 'Augsburg',
      prefix: 'Stadt'
    })
  ]

  it('should fetch and set cities if cities are not available', async () => {
    const dataContainer = new DefaultDataContainer()
    const setCities = jest.fn()
    dataContainer.setCities = setCities
    const result = await runSaga({}, loadCities, dataContainer, false).toPromise()

    expect(result).toStrictEqual(newCities)
    expect(setCities).toHaveBeenCalledTimes(1)
    expect(setCities).toHaveBeenCalledWith(newCities)
  })

  it('should fetch and set cities if it should update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCities(oldCities)
    const setCities = jest.fn()
    dataContainer.setCities = setCities
    const result = await runSaga({}, loadCities, dataContainer, true).toPromise()

    expect(result).toStrictEqual(newCities)
    expect(setCities).toHaveBeenCalledTimes(1)
    expect(setCities).toHaveBeenCalledWith(newCities)
  })

  it('should use cached cities if cities are available and it should not update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setCities(oldCities)
    const setCities = jest.fn()
    dataContainer.setCities = setCities
    const result = await runSaga({}, loadCities, dataContainer, false).toPromise()

    expect(result).toStrictEqual(oldCities)
    expect(setCities).not.toHaveBeenCalled()
  })
})
