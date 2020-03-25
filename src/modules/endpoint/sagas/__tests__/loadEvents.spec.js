// @flow

import { runSaga } from 'redux-saga'
import DefaultDataContainer from '../../DefaultDataContainer'
import loadEvents from '../loadEvents'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import EventModelBuilder from '../../../../testing/builder/EventModelBuilder'
import DatabaseContext from '../../DatabaseContext'
import DatabaseConnector from '../../DatabaseConnector'

let mockEvents
jest.mock('@react-native-community/async-storage')
jest.mock('rn-fetch-blob')
jest.mock('@integreat-app/integreat-api-client',
  () => {
    const actual = jest.requireActual('@integreat-app/integreat-api-client')
    const city = 'augsburg'
    const language = 'de'

    return {
      ...actual,
      createEventsEndpoint: () => {
        const { EndpointBuilder } = require('@integreat-app/integreat-api-client')
        const { default: EventModelBuilder } = require('../../../../testing/builder/EventModelBuilder')

        mockEvents = new EventModelBuilder('mockEvents', 1, city, language).build()

        return new EndpointBuilder('events-mock')
          .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/events')
          .withResponseOverride(mockEvents)
          .withMapper(() => { })
          .build()
      }
    }
  })

describe('loadEvents', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const city = 'augsburg'
  const language = 'de'

  const otherEvents = new EventModelBuilder('otherEvents', 2, city, language).build()

  it('should fetch and set events if events are not available', async () => {
    const dataContainer = new DefaultDataContainer()

    await runSaga({}, loadEvents, city, language, dataContainer, false).toPromise()

    expect(await dataContainer.getEvents(city, language)).toStrictEqual(mockEvents)
  })

  it('should fetch and set events if it should update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setEvents(city, language, otherEvents)

    await runSaga({}, loadEvents, city, language, dataContainer, true).toPromise()

    expect(await dataContainer.getEvents(city, language)).toStrictEqual(mockEvents)
  })

  it('should use cached events if they are available and should not be update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setEvents(city, language, otherEvents)

    await runSaga({}, loadEvents, city, language, dataContainer, false).toPromise()

    expect(await dataContainer.getEvents(city, language)).toBe(otherEvents)
  })

  it('should fetch events if the stored JSON is malformatted', async () => {
    const context = new DatabaseContext('augsburg', 'de')
    const path = new DatabaseConnector().getContentPath('events', context)
    await RNFetchBlob.fs.writeFile(path, '{ "i": { "am": "malformatted" } }', 'utf-8')
    const dataContainer = new DefaultDataContainer()
    const events = await runSaga({}, loadEvents, city, language, dataContainer, false).toPromise()

    expect(events).toBe(mockEvents)
  })
})
