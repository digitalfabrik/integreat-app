import path from 'path'
import { expectSaga, testSaga } from 'redux-saga-test-plan'

import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'

import BlobUtil from '../../__mocks__/react-native-blob-util'
import { ClearResourcesAndCacheActionType } from '../../redux/StoreActionType'
import { CACHE_DIR_PATH } from '../../utils/DatabaseConnector'
import DefaultDataContainer from '../../utils/DefaultDataContainer'
import watchClearResourcesAndCache, { clearResourcesAndCache } from '../watchClearResourcesAndCache'

describe('watchClearResourcesAndCache', () => {
  beforeEach(() => {
    BlobUtil.fs._reset()
  })
  it('should delete all data in offline cache', async () => {
    // populate the offline cache
    await BlobUtil.fs.writeFile(
      path.join(CACHE_DIR_PATH, 'testFile.json'),
      JSON.stringify({
        this: 'is',
        a: 'cool',
        json: 111
      }),
      'utf-8'
    )
    await BlobUtil.fs.writeFile(
      path.join(CACHE_DIR_PATH, 'notSoSecretDirectory', 'testFile2.json'),
      JSON.stringify({
        this: 'expression',
        is: true,
        not: false
      }),
      'utf-8'
    )
    const action: ClearResourcesAndCacheActionType = {
      type: 'CLEAR_RESOURCES_AND_CACHE'
    }
    const dataContainer = new DefaultDataContainer()
    await expectSaga(clearResourcesAndCache, dataContainer, action).run()
    expect(await BlobUtil.fs.ls(CACHE_DIR_PATH)).toHaveLength(0)
  })
  it('should delete all data in in-memory caches', async () => {
    const dataContainer = new DefaultDataContainer()
    const action: ClearResourcesAndCacheActionType = {
      type: 'CLEAR_RESOURCES_AND_CACHE'
    }
    // populate some caches
    const cityModels = new CityModelBuilder(3).build()
    await dataContainer.setCities(cityModels)
    const languageModels = new LanguageModelBuilder(3).build()
    await dataContainer.setLanguages('augsburg', languageModels)
    await expectSaga(clearResourcesAndCache, dataContainer, action).run()
    expect(await dataContainer.languagesAvailable('augsburg')).toBeFalsy()
    expect(await dataContainer.citiesAvailable()).toBeFalsy()
  })
  it('should trigger a reload of the cities', () => {
    const dataContainer = new DefaultDataContainer()
    expectSaga(watchClearResourcesAndCache, dataContainer)
      .take('CLEAR_RESOURCES_AND_CACHE')
      .put({
        type: 'FETCH_CITIES',
        params: {
          forceRefresh: false
        }
      })
  })
  it('should correctly call clearResourcesAndCache when triggered', async () => {
    const dataContainer = new DefaultDataContainer()
    testSaga(watchClearResourcesAndCache, dataContainer)
      .next()
      .takeLatest('CLEAR_RESOURCES_AND_CACHE', clearResourcesAndCache, dataContainer)
  })
})
