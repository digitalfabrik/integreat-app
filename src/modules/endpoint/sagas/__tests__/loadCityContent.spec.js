// @flow

import DefaultDataContainer from '../../DefaultDataContainer'
import RNFetchBlob from '../../../../__mocks__/rn-fetch-blob'
import { expectSaga } from 'redux-saga-test-plan'
import loadCityContent from '../loadCityContent'
import AppSettings from '../../../settings/AppSettings'
import { ContentLoadCriterion } from '../../ContentLoadCriterion'
import type { DataContainer } from '../../DataContainer'
import type { FetchMapType } from '../fetchResourceCache'
import CategoriesMapModelBuilder from '../../../../testing/builder/CategoriesMapModelBuilder'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'
import CityModelBuilder from '../../../../testing/builder/CitiyModelBuilder'

jest.mock('@react-native-community/async-storage')
jest.mock('@react-native-community/netinfo')
jest.mock('rn-fetch-blob')
jest.mock('../fetchResourceCache', () =>
  (city: string, language: string, fetchMap: FetchMapType, dataContainer: DataContainer) => {
  }
)

describe('loadCityContent', () => {
  beforeEach(() => {
    RNFetchBlob.fs._reset()
  })
  const city = 'augsburg'
  const language = 'en'

  it('should set selected city when not peeking', async () => {
    const dataContainer = new DefaultDataContainer()

    const categoriesBuilder = new CategoriesMapModelBuilder()
    const categories = categoriesBuilder.build()
    const resources = categoriesBuilder.buildResources()
    const languages = new LanguageModelBuilder(2).build()

    await dataContainer.setCategoriesMap(city, language, categories)
    await dataContainer.setLanguages(city, languages)
    await dataContainer.setResourceCache(city, language, resources)
    const cities = new CityModelBuilder(1).build()
    await dataContainer.setCities(cities)

    await expectSaga(loadCityContent,
      dataContainer, city, language, new ContentLoadCriterion({
        forceUpdate: false,
        shouldRefreshResources: true
      }, false)
    ).run()

    expect(await new AppSettings().loadSelectedCity()).toBe('augsburg')
  })
})
