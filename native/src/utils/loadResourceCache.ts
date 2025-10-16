import NetInfo from '@react-native-community/netinfo'
import { flatten, pickBy, reduce, values } from 'lodash'

import { CategoriesMapModel, EventModel, ExtendedPageModel, PoiModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { ResourceCacheEntryStateType } from './DataContainer'
import dataContainer from './DefaultDataContainer'
import FetcherModule, { TargetFilePathsType } from './FetcherModule'
import ResourceURLFinder from './ResourceURLFinder'
import buildResourceFilePath from './buildResourceFilePath'

export type FetchMapTargetType = {
  url: string
  filePath: string
  urlHash: string
}

export type FetchMapType = FetchMapTargetType[]

const loadResourceCache = async ({
  cityCode,
  languageCode,
  categories,
  events,
  pois,
}: {
  cityCode: string
  languageCode: string
  categories: CategoriesMapModel | null
  events: EventModel[] | null
  pois: PoiModel[] | null
}): Promise<void> => {
  const netInfo = await NetInfo.fetch()
  if (FetcherModule.currentlyFetching || netInfo.type === 'cellular') {
    return
  }

  const resourceURLFinder = new ResourceURLFinder(buildConfig().allowedHostNames)
  resourceURLFinder.init()
  const input = (categories?.toArray() ?? ([] as ExtendedPageModel[])).concat(events ?? []).concat(pois ?? [])

  if (input.length === 0) {
    return
  }

  const currentResourceCache = await dataContainer.getResourceCache(cityCode, languageCode)

  const currentlyCachedFiles = Object.values(currentResourceCache).map(Object.keys).flat()

  const fetchMap = resourceURLFinder.buildFetchMap(
    input,
    (url, urlHash) => buildResourceFilePath(url, cityCode, urlHash),
    currentlyCachedFiles,
  )
  resourceURLFinder.finalize()

  const fetchMapTargets = flatten<FetchMapTargetType>(values(fetchMap))
  const targetFilePaths = reduce<FetchMapTargetType, TargetFilePathsType>(
    fetchMapTargets,
    (acc, value) => {
      acc[value.filePath] = value.url
      return acc
    },
    {},
  )

  const fetcherModule = new FetcherModule()
  const results = await fetcherModule.fetchAsync(targetFilePaths)
  const successResults = pickBy(results, result => !result.errorMessage)

  const resourceCache = reduce(
    fetchMap,
    (acc: Record<string, ResourceCacheEntryStateType>, fetchMapTarget: FetchMapTargetType) => {
      const { filePath } = fetchMapTarget
      const downloadResult = successResults[filePath]

      if (downloadResult) {
        acc[downloadResult.url] = {
          filePath,
          hash: fetchMapTarget.urlHash,
        }
      }

      return acc
    },
    {},
  )
  await dataContainer.setResourceCache(cityCode, languageCode, resourceCache)
}

export default loadResourceCache
