// @flow

import { runSaga } from 'redux-saga'
import DefaultDataContainer from '../../DefaultDataContainer'
import loadEvents from '../loadEvents'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import EventModelBuilder from '../../../../testing/builder/EventModelBuilder'

let mockEvents
jest.mock('rn-fetch-blob')
jest.mock('@integreat-app/integreat-api-client/endpoints/createEventsEndpoint',
  () => () => {
    const { EndpointBuilder } = require('@integreat-app/integreat-api-client')
    const EventArrayBuilder = require('../../../../testing/builder/EventModelBuilder').default

    mockEvents = new EventArrayBuilder('mockEvents', 1).build()

    return new EndpointBuilder('events-mock')
      .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/events')
      .withResponseOverride(mockEvents)
      .withMapper(() => { })
      .build()
  }
)

describe('loadEvents', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const otherEvents = new EventModelBuilder('otherEvents', 2).build()
  const city = 'augsburg'
  const language = 'de'

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
})
