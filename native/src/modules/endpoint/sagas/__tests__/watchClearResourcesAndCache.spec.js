// @flow

import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import { CACHE_DIR_PATH } from '../../DatabaseConnector'
import path from 'path'
import DefaultDataContainer from '../../DefaultDataContainer'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import watchClearResourcesAndCache, { clearResourcesAndCache } from '../watchClearResourcesAndCache'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'

jest.mock('rn-fetch-blob')

describe('watchClearResourcesAndCache', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })

  it('should delete all data in offline cache', async () => {
    // populate the offline cache
    await RNFetchBlob.fs.writeFile(path.join(CACHE_DIR_PATH, 'testFile.json'), JSON.stringify({
      this: 'is',
      a: 'cool',
      json: 111
    }), 'utf-8')
    await RNFetchBlob.fs.writeFile(path.join(CACHE_DIR_PATH, 'notSoSecretDirectory', 'testFile2.json'), JSON.stringify({
      this: 'expression',
      is: true,
      not: false
    }), 'utf-8')

    const action = { type: 'CLEAR_RESOURCES_AND_CACHE' }
    const dataContainer = new DefaultDataContainer()

    await expectSaga(clearResourcesAndCache, dataContainer, action).run()
    expect(await RNFetchBlob.fs.ls(CACHE_DIR_PATH)).toHaveLength(0)
  })

  it('should delete all data in in-memory caches', async () => {
    const dataContainer = new DefaultDataContainer()
    const action = { type: 'CLEAR_RESOURCES_AND_CACHE' }

    // populate some caches
    const cityModels = new CityModelBuilder(3).build()
    await dataContainer.setCities(cityModels)
    const languageModels = new LanguageModelBuilder(3).build()
    await dataContainer.setLanguages('augsburg', languageModels)

    await expectSaga(clearResourcesAndCache, dataContainer, action).run()

    expect(await dataContainer.languagesAvailable('augsburg')).toBeFalse()
    expect(await dataContainer.citiesAvailable()).toBeFalse()
  })

  it('should trigger a reload of the cities', () => {
    const dataContainer = new DefaultDataContainer()

    expectSaga(watchClearResourcesAndCache, dataContainer)
      .take('CLEAR_RESOURCES_AND_CACHE', clearResourcesAndCache, dataContainer)
      .put({ type: 'FETCH_CITIES', params: { forceRefresh: false } })
  })

  it('should correctly call clearResourcesAndCache when triggered', async () => {
    const dataContainer = new DefaultDataContainer()

    testSaga(watchClearResourcesAndCache, dataContainer)
      .next()
      .takeLatest('CLEAR_RESOURCES_AND_CACHE', clearResourcesAndCache, dataContainer)
  })
})
