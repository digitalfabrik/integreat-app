import NetInfo from '@react-native-community/netinfo'
import { flatten, mapValues, pickBy, reduce, values } from 'lodash'
import moment from 'moment'

import { CategoriesMapModel, EventModel, ExtendedPageModel, PoiModel } from 'api-client'

import buildConfig from '../constants/buildConfig'
import { PageResourceCacheEntryStateType } from '../redux/StateType'
import dataContainer from '../utils/DefaultDataContainer'
import FetcherModule, { TargetFilePathsType } from '../utils/FetcherModule'
import ResourceURLFinder from '../utils/ResourceURLFinder'
import buildResourceFilePath from '../utils/buildResourceFilePath'

type FetchMapTargetType = {
  url: string
  filePath: string
  urlHash: string
}

type UseLoadResourceCacheProps = {
  cityCode: string
  languageCode: string
  categories: CategoriesMapModel | null
  events: EventModel[] | null
  pois: PoiModel[] | null
}

const loadResourceCache = async ({
  cityCode,
  languageCode,
  categories,
  events,
  pois,
}: UseLoadResourceCacheProps): Promise<void> => {
  const netInfo = await NetInfo.fetch()
  if (FetcherModule.currentlyFetching || netInfo.type === 'cellular') {
    return
  }

  const resourceURLFinder = new ResourceURLFinder(buildConfig().allowedHostNames)
  resourceURLFinder.init()
  const input = (categories?.toArray() ?? ([] as ExtendedPageModel[]))
    .concat(events ?? [])
    .concat(pois ?? [])
    .map(it => ({
      path: it.path,
      thumbnail: it.thumbnail,
      content: it.content,
    }))

  if (input.length === 0) {
    return
  }

  const fetchMap = resourceURLFinder.buildFetchMap(input, (url, urlHash) =>
    buildResourceFilePath(url, cityCode, urlHash)
  )
  resourceURLFinder.finalize()

  const fetchMapTargets = flatten<FetchMapTargetType>(values(fetchMap))
  const targetFilePaths = reduce<FetchMapTargetType, TargetFilePathsType>(
    fetchMapTargets,
    (acc, value) => {
      acc[value.filePath] = value.url
      return acc
    },
    {}
  )

  const fetcherModule = new FetcherModule()
  const results = await fetcherModule.fetchAsync(targetFilePaths)
  const successResults = pickBy(results, result => !result.errorMessage)

  const resourceCache = mapValues(fetchMap, fetchMapEntry =>
    reduce(
      fetchMapEntry,
      (acc: Record<string, PageResourceCacheEntryStateType>, fetchMapTarget: FetchMapTargetType) => {
        const { filePath } = fetchMapTarget
        const downloadResult = successResults[filePath]

        if (downloadResult) {
          acc[downloadResult.url] = {
            filePath,
            lastUpdate: moment(downloadResult.lastUpdate),
            hash: fetchMapTarget.urlHash,
          }
        }

        return acc
      },
      {}
    )
  )
  await dataContainer.setResourceCache(cityCode, languageCode, resourceCache)
}

export default loadResourceCache
