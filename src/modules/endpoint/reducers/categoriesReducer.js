// @flow

import type { CategoriesFetchActionType } from '../../app/StoreActionType'
import type { CategoriesStateType } from '../../app/StateType'

export default (state: CategoriesStateType = {jsons: {}, city: undefined}, action: CategoriesFetchActionType): any => {
  switch (action.type) {
    case 'CATEGORIES_FETCH_SUCCEEDED':
      const city = action.city
      const language = action.language

      const byLanguages = {...state.jsons[city], [language]: action.payload.data}
      const byCity = {...state.jsons, [city]: byLanguages}
      return {...state, city: city, jsons: byCity}
    default:
      return state
  }
}
