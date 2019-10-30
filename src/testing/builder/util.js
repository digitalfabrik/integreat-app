// @flow

import type { PageResourceCacheStateType } from '../../modules/app/StateType'
import type { FetchMapTargetType, FetchMapType } from '../../modules/endpoint/sagas/fetchResourceCache'
import { mapValues, reduce } from 'lodash'

export const createFetchMap = (resources: { [path: string]: PageResourceCacheStateType }): FetchMapType =>
  mapValues(resources, (files: FileCacheStateType) =>
    reduce<FileCacheStateType, Array<FetchMapTargetType>>(files, (fetchMapEntry, file, url) => {
      fetchMapEntry.push({ url, filePath: file.filePath, urlHash: file.hash })
      return fetchMapEntry
    }, [])
  )
