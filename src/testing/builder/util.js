// @flow

import type { FileCacheStateType } from '../../modules/app/StateType'
import type { FetchMapType } from '../../modules/endpoint/sagas/fetchResourceCache'
import { forEach, transform } from 'lodash'

export const createFetchMap = (resources: { [path: string]: FileCacheStateType }): FetchMapType => {
  return transform(resources, (result, value, path) => {
    forEach(value, (value, url) => {
      result[value.filePath] = [url, path, value.hash]
    })
    return result
  }, {})
}
