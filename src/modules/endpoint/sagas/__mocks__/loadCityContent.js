// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import type { DataContainer } from '../../DataContainer'
import { ContentLoadCriterion } from '../../ContentLoadCriterion'
import EventModelBuilder from '../../../../testing/builder/EventModelBuilder'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'

export default function * loadCityContent (
  dataContainer: DataContainer, newCity: string, newLanguage: string,
  criterion: ContentLoadCriterion
): Saga<boolean> {
  yield call(() => dataContainer.setEvents(
    newCity,
    newLanguage,
    new EventModelBuilder('loadCityContent-events', 2).build())
  )

  if (criterion.shouldLoadLanguages()) {
    const languages = new LanguageModelBuilder(2).build()
    yield call(() => dataContainer.setLanguages(
      newCity,
      languages)
    )

    if (!languages.map(language => language.code).includes(newLanguage)) {
      return false
    }
  }
  return true
}
