import { call, StrictEffect } from 'redux-saga/effects'
import { DataContainer } from '../../DataContainer'
import { ContentLoadCriterion } from '../../ContentLoadCriterion'
import { LanguageModel } from 'api-client'

const loadCityContent = function* loadCityContent(
  dataContainer: DataContainer,
  newCity: string,
  newLanguage: string,
  criterion: ContentLoadCriterion
): Generator<StrictEffect, boolean, Array<LanguageModel> | boolean> {
  const languagesAvailable = (yield call(() => dataContainer.languagesAvailable(newCity))) as boolean

  if (!languagesAvailable) {
    console.error('You have to prepare the data container properly in order to use the loadCityContent.js mock!')
  }

  if (criterion.shouldLoadLanguages()) {
    const languages = (yield call(() => dataContainer.getLanguages(newCity))) as Array<LanguageModel>

    if (!languages.map(language => language.code).includes(newLanguage)) {
      return false
    }
  }

  return true
}

export default loadCityContent
