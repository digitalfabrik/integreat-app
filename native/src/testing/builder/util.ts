import { PageResourceCacheEntryStateType, PageResourceCacheStateType } from '../../modules/app/StateType'
import { FetchMapTargetType, FetchMapType } from '../../modules/endpoint/sagas/fetchResourceCache'
import { mapValues, reduce } from 'lodash'
export const createFetchMap = (resources: Record<string, PageResourceCacheStateType>): FetchMapType =>
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
