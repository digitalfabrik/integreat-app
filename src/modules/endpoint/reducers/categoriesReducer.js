// @flow

import type { ResourcesDownloadSucceededActionType } from '../../app/StoreActionType'
import type { CategoriesStateType } from '../../app/StateType'

export default (state: CategoriesStateType = {
  jsons: {},
  city: undefined,
  hashes: {}
}, action: ResourcesDownloadSucceededActionType | ResourcesDownloadSucceededActionType): any => {
  const city = action.city
  const language = action.language

  switch (action.type) {
    case 'RESOURCES_DOWNLOAD_SUCCEEDED':
      const hashesByCity = {...state.hashes, [city]: action.downloaded}
      return {...state, hashes: hashesByCity}
    case 'CATEGORIES_FETCH_SUCCEEDED':
      const byLanguages = {...state.jsons[city], [language]: action.payload.data}
      const byCity = {...state.jsons, [city]: byLanguages}
      return {...state, city: city, jsons: byCity}
    default:
      return state
  }
}
