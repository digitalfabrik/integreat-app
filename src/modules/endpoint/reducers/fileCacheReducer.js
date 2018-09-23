// @flow

import type { ResourcesDownloadActionType } from '../../app/StoreActionType'
import type { FileCacheStateType } from '../../app/StateType'

export default (state: FileCacheStateType = {}, action: ResourcesDownloadActionType): any => {
  const initialCity = {files: {}, ready: false, error: undefined}
  let city
  let newCity
  let previousCity

  switch (action.type) {
    case 'RESOURCES_DOWNLOAD_SUCCEEDED':
      city = action.city
      previousCity = state[city] || initialCity

      newCity = {...previousCity, ready: true}
      return {...state, [city]: newCity}
    case 'RESOURCES_DOWNLOAD_PARTIALLY_SUCCEEDED':
      city = action.city
      previousCity = state[city] || initialCity

      const newFiles = {...previousCity.files, ...action.downloaded}
      newCity = {...previousCity, files: newFiles, ready: false}
      return {...state, [city]: newCity}
    default:
      return state
  }
}
