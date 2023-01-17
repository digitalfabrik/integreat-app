import { mapValues, reduce } from 'lodash'

import { FetchMapTargetType, FetchMapType } from '../../hooks/useLoadResourceCache'
import { PageResourceCacheStateType } from '../../utils/DataContainer'

export const createFetchMap = (resources: Record<string, PageResourceCacheStateType>): FetchMapType =>
  mapValues(resources, (files: PageResourceCacheStateType) =>
    reduce<PageResourceCacheStateType, Array<FetchMapTargetType>>(
      files,
      (fetchMapEntry, file, url: string) => {
        fetchMapEntry.push({
          url,
          filePath: file.filePath,
          urlHash: file.hash,
        })
        return fetchMapEntry
      },
      []
    )
  )
