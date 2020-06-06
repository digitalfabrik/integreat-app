// @flow

import { runSaga } from 'redux-saga'
import DefaultDataContainer from '../../DefaultDataContainer'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import DatabaseConnector from '../../DatabaseConnector'
import PoiModelBuilder from '../../../../testing/builder/PoiModelBuilder'
import loadPois from '../loadPois'
import DatabaseContext from '../../DatabaseContext'

let mockPois
jest.mock('@react-native-community/async-storage')
jest.mock('rn-fetch-blob')
jest.mock('@integreat-app/integreat-api-client',
  () => {
    const actual = jest.requireActual('@integreat-app/integreat-api-client')
    return {
      ...actual,
      createPOIsEndpoint: () => {
        const { EndpointBuilder } = require('@integreat-app/integreat-api-client')
        const { default: PoiModelBuilder } = require('../../../../testing/builder/PoiModelBuilder')

        mockPois = new PoiModelBuilder(2).build()

        return new EndpointBuilder('pois-mock')
          .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/sites')
          .withResponseOverride(mockPois)
          .withMapper(() => { })
          .build()
      }
    }
  })

describe('loadPois', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const city = 'augsburg'
  const language = 'de'

  const otherPois = new PoiModelBuilder(2).build()

  it('should fetch and set pois if pois are not available', async () => {
    const dataContainer = new DefaultDataContainer()

    await runSaga({}, loadPois, city, language, dataContainer, false).toPromise()
    expect(await dataContainer.getPois(city, language)).toStrictEqual(mockPois)
  })

  it('should fetch and set pois if it should update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setPois(city, language, otherPois)

    await runSaga({}, loadPois, city, language, dataContainer, true).toPromise()

    expect(await dataContainer.getPois(city, language)).toStrictEqual(mockPois)
  })

  it('should use cached pois if they are available and should not update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setPois(city, language, otherPois)
    await runSaga({}, loadPois, city, language, dataContainer, false).toPromise()

    expect(await dataContainer.getPois(city, language)).toBe(otherPois)
  })

  it('should fetch pois if the stored JSON is malformatted', async () => {
    const context = new DatabaseContext('augsburg', 'de')
    const path = new DatabaseConnector().getContentPath('pois', context)
    await RNFetchBlob.fs.writeFile(path, '{ "i": { "am": "malformatted" } }', 'utf-8')
    const dataContainer = new DefaultDataContainer()
    const pois = await runSaga({}, loadPois, city, language, dataContainer, false).toPromise()

    expect(pois).toBe(mockPois)
  })
})
