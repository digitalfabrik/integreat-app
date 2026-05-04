import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo'
import { flatten, pickBy, reduce, values } from 'lodash'

import { CategoriesMapModel, EventModel, ExtendedDocumentModel, PoiModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { LanguageResourceCacheStateType } from './DataContainer'
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
  regionCode,
  languageCode,
  categories,
  events,
  pois,
}: {
  regionCode: string
  languageCode: string
  categories: CategoriesMapModel | null
  events: EventModel[] | null
  pois: PoiModel[] | null
}): Promise<void> => {
  const netInfo = await NetInfo.fetch()
  if (FetcherModule.currentlyFetching || netInfo.type === NetInfoStateType.cellular) {
    return
  }

  const resourceURLFinder = new ResourceURLFinder(buildConfig().allowedHostNames)
  resourceURLFinder.init()
  const input = (categories?.toArray() ?? ([] as ExtendedDocumentModel[])).concat(events ?? []).concat(pois ?? [])

  if (input.length === 0) {
    return
  }

  const currentResourceCache = await dataContainer.getResourceCache(regionCode, languageCode)

  const currentlyCachedFiles = Object.values(currentResourceCache).map(Object.keys).flat()

  const fetchMap = resourceURLFinder.buildFetchMap(
    input,
    (url, urlHash) => buildResourceFilePath(url, regionCode, urlHash),
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
    (acc: LanguageResourceCacheStateType, fetchMapTarget: FetchMapTargetType) => {
      const { filePath } = fetchMapTarget
      const downloadResult = successResults[filePath]

      if (downloadResult) {
        acc[downloadResult.url] = filePath
      }

      return acc
    },
    {},
  )
  await dataContainer.setResourceCache(regionCode, languageCode, resourceCache)
}

export default loadResourceCache
