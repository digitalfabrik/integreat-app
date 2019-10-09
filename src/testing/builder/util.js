// @flow

import type { FileCacheStateType } from '../../modules/app/StateType'
import type { FetchMapEntryType, FetchMapType } from '../../modules/endpoint/sagas/fetchResourceCache'
import { mapValues, reduce } from 'lodash'

export const createFetchMap = (resources: { [path: string]: FileCacheStateType }): FetchMapType =>
  mapValues(resources, (files: FileCacheStateType) =>
    reduce<FileCacheStateType, FetchMapEntryType>(files, (fetchMapEntry, file, url) => {
      fetchMapEntry.push({ url, filePath: file.filePath, urlHash: file.hash })
      return fetchMapEntry
    }, [])
  )
