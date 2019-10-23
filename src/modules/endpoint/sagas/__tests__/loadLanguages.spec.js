// @flow

import { runSaga } from 'redux-saga'
import DefaultDataContainer from '../../DefaultDataContainer'
import loadLanguages from '../loadLanguages'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'

let mockLanguages
jest.mock('rn-fetch-blob')
jest.mock('@integreat-app/integreat-api-client',
  () => {
    const actual = jest.requireActual('@integreat-app/integreat-api-client')
    return {
      ...actual,
      createLanguagesEndpoint: () => {
        const { EndpointBuilder } = require('@integreat-app/integreat-api-client')
        const { default: LanguageModelBuilder } = require('../../../../testing/builder/LanguageModelBuilder')

        mockLanguages = new LanguageModelBuilder(1).build()
        return new EndpointBuilder('languages-mock')
          .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/languages')
          .withResponseOverride(mockLanguages)
          .withMapper(() => { })
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
})
