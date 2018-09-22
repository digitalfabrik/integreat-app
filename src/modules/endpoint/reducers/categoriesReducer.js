// @flow

import type {
  CategoriesFetchSucceededActionType,
  FetchCategoriesRequestActionType,
  ResourcesDownloadActionType
} from '../../app/StoreActionType'
import type { CategoriesStateType } from '../../app/StateType'

const initialState: CategoriesStateType = {
  // current_city: undefined,
  cities: {}
}

export default (state: CategoriesStateType = initialState, action: ResourcesDownloadActionType | CategoriesFetchSucceededActionType | FetchCategoriesRequestActionType): any => {
  let city
  let newCity
  let language
  let previousCity

  switch (action.type) {
    case 'FETCH_CATEGORIES_REQUEST':
      return initialState
    case 'RESOURCES_DOWNLOAD_SUCCEEDED':
      city = action.city
      previousCity = state.cities[city] || {}

      newCity = {...previousCity, download_finished: true}
      return {...state, cities: {...state.cities, [city]: newCity}}
    case 'RESOURCES_DOWNLOAD_PARTIALLY_SUCCEEDED':
      city = action.city
      previousCity = state.cities[city] || {}

      const newFiles = {...previousCity.files, ...action.downloaded}
      newCity = {...previousCity, files: newFiles, download_finished: false}
      return {...state, cities: {...state.cities, [city]: newCity}}
    case 'CATEGORIES_FETCH_SUCCEEDED':
      city = action.city
      language = action.language
      previousCity = state.cities[city] || {}

      const newJson = {...previousCity.json, [language]: action.payload.data}
      newCity = {...previousCity, json: newJson}
      return {...state, cities: {...state.cities, [city]: newCity}}
    default:
      return state
  }
}
