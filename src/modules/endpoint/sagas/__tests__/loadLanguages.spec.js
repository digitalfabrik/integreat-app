// @flow

import { LanguageModel } from '@integreat-app/integreat-api-client'
import { runSaga } from 'redux-saga'
import DefaultDataContainer from '../../DefaultDataContainer'
import loadLanguages from '../loadLanguages'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'

jest.mock('rn-fetch-blob')
jest.mock('@integreat-app/integreat-api-client/endpoints/createLanguagesEndpoint',
  () => () => {
    const { EndpointBuilder, LanguageModel } = require('@integreat-app/integreat-api-client')

    return new EndpointBuilder('languages-mock')
      .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/languages')
      .withResponseOverride([new LanguageModel('de', 'Deutsch')])
      .withMapper(() => { })
      .build()
  }
)

describe('loadLanguages', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const oldLanguages = [ new LanguageModel('en', 'English') ]

  const newLanguages = [ new LanguageModel('de', 'Deutsch') ]
  const city = 'augsburg'

  it('should fetch and set languages if languages are not available', async () => {
    const dataContainer = new DefaultDataContainer()

    await runSaga({}, loadLanguages, city, dataContainer, false).toPromise()

    expect(await dataContainer.getLanguages(city)).toStrictEqual(newLanguages)
  })

  it('should fetch and set languages if it should update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setLanguages(city, oldLanguages)

    await runSaga({}, loadLanguages, city, dataContainer, true).toPromise()

    expect(await dataContainer.getLanguages(city)).toStrictEqual(newLanguages)
  })

  it('should use cached languages if they are available and should not be update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setLanguages(city, oldLanguages)

    await runSaga({}, loadLanguages, city, dataContainer, false).toPromise()

    expect(await dataContainer.getLanguages(city)).toBe(oldLanguages)
  })
})
