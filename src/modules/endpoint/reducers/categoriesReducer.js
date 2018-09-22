// @flow

import type {
  CategoriesFetchSucceededActionType,
  FetchCategoriesRequestActionType,
  ResourcesDownloadSucceededActionType
} from '../../app/StoreActionType'
import type { CategoriesStateType } from '../../app/StateType'

const initialState: CategoriesStateType = {
  jsons: {},
  city: undefined,
  downloaded: undefined
}

export default (state: CategoriesStateType = initialState, action: ResourcesDownloadSucceededActionType | CategoriesFetchSucceededActionType | FetchCategoriesRequestActionType): any => {
  let city
  let language

  switch (action.type) {
    case 'FETCH_CATEGORIES_REQUEST':
      return initialState
    case 'RESOURCES_DOWNLOAD_SUCCEEDED':
      city = action.city

      const hashesByCity = {...state.downloaded, [city]: {} || action.downloaded}
      return {...state, downloaded: hashesByCity}
    case 'CATEGORIES_FETCH_SUCCEEDED':
      city = action.city
      language = action.language

      const byLanguages = {...state.jsons[city], [language]: action.payload.data}
      const byCity = {...state.jsons, [city]: byLanguages}
      return {...state, city: city, jsons: byCity}
    default:
      return state
  }
}
