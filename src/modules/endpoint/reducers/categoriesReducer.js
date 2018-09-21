// @flow

import type { CategoriesFetchActionType, ResourcesDownloadSucceededActionType } from '../../app/StoreActionType'
import type { CategoriesStateType } from '../../app/StateType'

export default (state: CategoriesStateType = {jsons: {}, city: undefined}, action: CategoriesFetchActionType | ResourcesDownloadSucceededActionType): any => {
  switch (action.type) {
    case 'RESOURCES_DOWNLOAD_SUCCEEDED':
      return {...state, hashes: action.downloaded}
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
