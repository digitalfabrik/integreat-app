// @flow

import { runSaga } from 'redux-saga'
import DefaultDataContainer from '../../DefaultDataContainer'
import loadLanguages from '../loadLanguages'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import DatabaseContext from '../../DatabaseContext'
import DatabaseConnector from '../../DatabaseConnector'

let mockLanguages
jest.mock('rn-fetch-blob')
jest.mock('api-client', () => {
  const actual = jest.requireActual('api-client')
  return {
    ...actual,
    createLanguagesEndpoint: () => {
      const { EndpointBuilder } = require('api-client')
      const { default: LanguageModelBuilder } = require('api-client/src/testing/LanguageModelBuilder')

      mockLanguages = new LanguageModelBuilder(1).build()
      return new EndpointBuilder('languages-mock')
        .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/languages')
        .withResponseOverride(mockLanguages)
        .withMapper(() => {})
        .build()
    }
  }
})

describe('loadLanguages', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  const otherLanguages = new LanguageModelBuilder(2).build()

  const city = 'augsburg'

  it('should fetch and set languages if languages are not available', async () => {
    const dataContainer = new DefaultDataContainer()

    await runSaga({}, loadLanguages, city, dataContainer, false).toPromise()

    expect(await dataContainer.getLanguages(city)).toStrictEqual(mockLanguages)
  })

  it('should fetch and set languages if it should update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setLanguages(city, otherLanguages)

    await runSaga({}, loadLanguages, city, dataContainer, true).toPromise()

    expect(await dataContainer.getLanguages(city)).toStrictEqual(mockLanguages)
  })

  it('should use cached languages if they are available and should not be update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setLanguages(city, otherLanguages)

    await runSaga({}, loadLanguages, city, dataContainer, false).toPromise()

    expect(await dataContainer.getLanguages(city)).toBe(otherLanguages)
  })

  it('should fetch languages if the stored JSON is malformatted', async () => {
    const context = new DatabaseContext('augsburg', 'de')
    const path = new DatabaseConnector().getContentPath('languages', context)
    await RNFetchBlob.fs.writeFile(path, '{ "i": { "am": "malformatted" } }', 'utf-8')
    const dataContainer = new DefaultDataContainer()
    const languages = await runSaga({}, loadLanguages, city, dataContainer, false).toPromise()

    expect(languages).toBe(mockLanguages)
  })
})
