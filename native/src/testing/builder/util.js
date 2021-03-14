// @flow

import type { PageResourceCacheEntryStateType, PageResourceCacheStateType } from '../../modules/app/StateType'
import type { FetchMapTargetType, FetchMapType } from '../../modules/endpoint/sagas/fetchResourceCache'
import { mapValues, reduce } from 'lodash'

export const createFetchMap = (resources: { [path: string]: PageResourceCacheStateType }): FetchMapType =>
  mapValues(resources, (files: PageResourceCacheStateType) =>
    reduce<PageResourceCacheEntryStateType, PageResourceCacheStateType, Array<FetchMapTargetType>>(
      files,
      (fetchMapEntry, file, url: string) => {
        fetchMapEntry.push({
          url,
          filePath: file.filePath,
          urlHash: file.hash
        })
        return fetchMapEntry
      },
      []
    )
  )
