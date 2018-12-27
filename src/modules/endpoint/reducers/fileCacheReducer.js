// @flow

import type {
  ResourcesDownloadActionType,
  ResourcesDownloadFailedActionType,
  ResourcesDownloadSucceededActionType
} from '../../app/StoreActionType'
import type { FileCacheStateType } from '../../app/StateType'

const initialCity = {files: {}, ready: false, error: undefined}

const success = (state, action: ResourcesDownloadSucceededActionType): any => {
  const city = action.city
  const previousCity = state[city] || initialCity

  const newFiles = {...previousCity.files, ...action.files}
  const newCity = {...previousCity, files: newFiles, ready: true}
  return {...state, [city]: newCity}
}

const failed = (state, action: ResourcesDownloadFailedActionType): any => {
  const city = action.city
  const previousCity = state[city] || {files: undefined, ready: false, error: undefined}

  const newCity = {...previousCity, error: action.message}
  return {...state, [city]: newCity}
}

export default (state: FileCacheStateType = {}, action: ResourcesDownloadActionType): any => {
  switch (action.type) {
    case 'RESOURCES_DOWNLOAD_SUCCEEDED':
      return success(state, action)
    case 'RESOURCES_DOWNLOAD_FAILED':
      return failed(state, action)
    default:
      return state
  }
}
