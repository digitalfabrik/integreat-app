import type { StateType } from '../../../modules/app/StateType'
import { createSelector } from 'reselect'
import categoriesEndpoint from '../../../modules/endpoint/endpoints/categories'

const categoriesJsonSelector = (state: StateType, props) => state.categories[props.targetCity].json[props.language]

const targetCitySelector = (state: StateType, props) => props.targetCity

const languageSelector = (state: StateType, props) => props.language

const categoriesSelector = createSelector(
  [categoriesJsonSelector, targetCitySelector, languageSelector],
  (json, targetCity, language) => categoriesEndpoint.mapResponse(json, {language, city: targetCity})
)

export default categoriesSelector
