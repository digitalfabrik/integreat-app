import { call, SagaGenerator } from 'typed-redux-saga'
import { DataContainer } from '../../utils/DataContainer'
import { ContentLoadCriterion } from '../../models/ContentLoadCriterion'

const loadCityContent = function* loadCityContent(
  dataContainer: DataContainer,
  newCity: string,
  newLanguage: string,
  criterion: ContentLoadCriterion
): SagaGenerator<boolean> {
  const languagesAvailable = yield* call(() => dataContainer.languagesAvailable(newCity))

  if (!languagesAvailable) {
    console.error('You have to prepare the data container properly in order to use the loadCityContent.js mock!')
  }

  if (criterion.shouldLoadLanguages()) {
    const languages = yield* call(() => dataContainer.getLanguages(newCity))

    if (!languages.map(language => language.code).includes(newLanguage)) {
      return false
    }
  }

  return true
}

export default loadCityContent
