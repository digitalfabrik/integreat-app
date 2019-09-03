// @flow

import { LanguageModel } from '@integreat-app/integreat-api-client'
import { runSaga } from 'redux-saga'
import DefaultDataContainer from '../../DefaultDataContainer'
import loadLanguages from '../loadLanguages'

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
    jest.clearAllMocks()
  })

  const oldLanguages = [ new LanguageModel('en', 'English') ]

  const newLanguages = [ new LanguageModel('de', 'Deutsch') ]
  const city = 'augsburg'

  it('should fetch and set cities if cities are not available', async () => {
    const dataContainer = new DefaultDataContainer()
    const setLanguages = jest.fn()
    dataContainer.setLanguages = setLanguages
    const result = await runSaga({}, loadLanguages, city, dataContainer, false).toPromise()

    expect(result).toStrictEqual(newLanguages)
    expect(setLanguages).toHaveBeenCalledTimes(1)
    expect(setLanguages).toHaveBeenCalledWith(city, newLanguages)
  })

  it('should fetch and set cities if it should update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setLanguages(city, oldLanguages)
    const setLanguages = jest.fn()
    dataContainer.setLanguages = setLanguages
    const result = await runSaga({}, loadLanguages, city, dataContainer, true).toPromise()

    expect(result).toStrictEqual(newLanguages)
    expect(setLanguages).toHaveBeenCalledTimes(1)
    expect(setLanguages).toHaveBeenCalledWith(city, newLanguages)
  })

  it('should use cached cities if cities are available and it should not update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setLanguages(city, oldLanguages)
    const setLanguages = jest.fn()
    dataContainer.setLanguages = setLanguages
    const result = await runSaga({}, loadLanguages, city, dataContainer, false).toPromise()

    expect(result).toStrictEqual(oldLanguages)
    expect(setLanguages).not.toHaveBeenCalled()
  })
})
