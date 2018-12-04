// @flow

import type { StateType } from '../../../modules/app/StateType'
import { createSelector, type OutputSelector } from 'reselect'
import { categoriesEndpoint } from '@integreat-app/integreat-api-client'
import CategoriesMapModel from '@integreat-app/integreat-api-client/models/CategoriesMapModel'

export type CategoriesSelectorPropsType = { targetCity: string, language: string }

export type CategoriesSelectorType = (state: StateType, props: CategoriesSelectorPropsType)
  => OutputSelector<StateType, CategoriesSelectorPropsType, CategoriesMapModel>

const categoriesSelector: CategoriesSelectorType = createSelector(
  (state, props) => state.categories[props.targetCity].json[props.language],
  (state, props) => props.targetCity,
  (state, props) => props.language,
  (json, targetCity, language) => categoriesEndpoint.mapResponse(json, {
    language,
    city: targetCity
  })
)

export default categoriesSelector
