// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import type { DataContainer } from '../../DataContainer'
import { ContentLoadCriterion } from '../../ContentLoadCriterion'

const loadCityContent = function * loadCityContent (
  dataContainer: DataContainer, newCity: string, newLanguage: string,
  criterion: ContentLoadCriterion
): Saga<boolean> {
  // const eventsBuilder = new EventModelBuilder('loadCityContent-events', 2)
  // yield call(() => dataContainer.setEvents(
  //   newCity,
  //   newLanguage,
  //   eventsBuilder.build())
  // )

  if (criterion.shouldLoadLanguages()) {
    // const languages = new LanguageModelBuilder(2).build()
    // yield call(() => dataContainer.setLanguages(
    //   newCity,
    //   languages)
    // )

    const languages = yield call(() => dataContainer.getLanguages(newCity))

    if (!languages.map(language => language.code).includes(newLanguage)) {
      return false
    }
  }

  // const isCellularConnection = false
  //
  // if (criterion.shouldRefreshResources() && !isCellularConnection) {
  //   yield call(dataContainer.setResourceCache, newCity, newLanguage, resources)
  // }

  return true
}

export default loadCityContent
