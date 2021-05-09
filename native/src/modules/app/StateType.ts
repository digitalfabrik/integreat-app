import { $ReadOnly } from 'utility-types'
import {
  CategoriesMapModel,
  CategoryModel,
  CityModel,
  EventModel,
  LanguageModel,
  LocalNewsModel,
  PoiModel,
  TunewsModel
} from 'api-client'
import Moment from 'moment'
import type { ErrorCodeType } from '../error/ErrorCodes'
import ErrorCodes from '../error/ErrorCodes'
import { config } from 'translations'
import type {
  CategoriesRouteType,
  EventsRouteType,
  NewsRouteType,
  NewsType,
  PoisRouteType
} from 'api-client/src/routes'
export type PathType = string
export type CategoryRouteConfigType = {
  readonly path: string
  readonly depth: number
  readonly language: string
  readonly city: string
}
export type CategoryRouteStateType =
  | (CategoryRouteConfigType & {
      readonly routeType: CategoriesRouteType
      readonly status: 'ready'
      readonly allAvailableLanguages: $ReadOnlyMap<string, string>
      // including the current content language
      readonly models: $ReadOnly<Record<PathType, CategoryModel>>

      /* Models could be stored outside of CategoryRouteStateType
                                                       (e.g. CategoriesStateType) to save memory
                                                       in the state. This would be an optimization! */
      readonly children: $ReadOnly<Record<PathType, ReadonlyArray<PathType>>>
    })
  | {
      readonly routeType: CategoriesRouteType
      readonly status: 'languageNotAvailable'
      readonly depth: number
      readonly city: string
      readonly language: string
      readonly allAvailableLanguages: $ReadOnlyMap<string, string>
    }
  | (CategoryRouteConfigType & {
      readonly routeType: CategoriesRouteType
      readonly status: 'loading'
      readonly allAvailableLanguages?: $ReadOnlyMap<string, string>
      readonly models?: $ReadOnly<Record<PathType, CategoryModel>>
      readonly children?: $ReadOnly<Record<PathType, ReadonlyArray<PathType>>>
    })
  | (CategoryRouteConfigType & {
      readonly routeType: CategoriesRouteType
      readonly status: 'error'
      readonly message: string
      readonly code: ErrorCodeType
    })
export type PoiRouteConfigType = {
  readonly path: string | null | undefined
  // path is null for the poi-lists route
  readonly language: string
  readonly city: string
}
export type PoiRouteStateType =
  | (PoiRouteConfigType & {
      readonly routeType: PoisRouteType
      readonly status: 'ready'
      readonly models: ReadonlyArray<PoiModel>
      readonly allAvailableLanguages: $ReadOnlyMap<string, string | null | undefined> // including the current content language
    })
  | (PoiRouteConfigType & {
      readonly routeType: PoisRouteType
      readonly status: 'languageNotAvailable'
      readonly allAvailableLanguages: $ReadOnlyMap<string, string | null | undefined>
    })
  | (PoiRouteConfigType & {
      readonly routeType: PoisRouteType
      readonly status: 'loading'
    })
  | (PoiRouteConfigType & {
      readonly routeType: PoisRouteType
      readonly status: 'error'
      readonly code: ErrorCodeType
      readonly message: string | null | undefined
    })
export type EventRouteConfigType = {
  readonly path: string | null | undefined
  // path is null for the event-lists route
  readonly language: string
  readonly city: string
}
export type EventRouteStateType =
  | (EventRouteConfigType & {
      readonly routeType: EventsRouteType
      readonly status: 'ready'
      readonly models: ReadonlyArray<EventModel>
      readonly allAvailableLanguages: $ReadOnlyMap<string, string | null | undefined> // including the current content language
    })
  | (EventRouteConfigType & {
      readonly routeType: EventsRouteType
      readonly status: 'languageNotAvailable'
      readonly allAvailableLanguages: $ReadOnlyMap<string, string | null | undefined>
    })
  | (EventRouteConfigType & {
      readonly routeType: EventsRouteType
      readonly status: 'loading'
      readonly models?: ReadonlyArray<EventModel>
      readonly allAvailableLanguages?: $ReadOnlyMap<string, string | null | undefined>
    })
  | (EventRouteConfigType & {
      readonly routeType: EventsRouteType
      readonly status: 'error'
      readonly code: ErrorCodeType
      readonly message: string | null | undefined
    })
export type NewsRouteConfigType = {
  readonly newsId: string | null | undefined
  // Path is null for the news list
  readonly language: string
  readonly city: string
  readonly type: NewsType
}
export type NewsModelsType = ReadonlyArray<LocalNewsModel | TunewsModel>
export type NewsRouteStateType =
  | (NewsRouteConfigType & {
      readonly routeType: NewsRouteType
      readonly status: 'ready'
      readonly models: NewsModelsType
      readonly hasMoreNews: boolean
      readonly page: number
      readonly allAvailableLanguages: $ReadOnlyMap<string, string | null | undefined>
    })
  | (NewsRouteConfigType & {
      readonly routeType: NewsRouteType
      readonly status: 'languageNotAvailable'
      readonly allAvailableLanguages: $ReadOnlyMap<string, string | null | undefined>
    })
  | (NewsRouteConfigType & {
      readonly routeType: NewsRouteType
      readonly status: 'loading'
    })
  | (NewsRouteConfigType & {
      readonly routeType: NewsRouteType
      readonly status: 'loadingMore'
      readonly models: NewsModelsType
    })
  | (NewsRouteConfigType & {
      readonly routeType: NewsRouteType
      readonly status: 'error'
      readonly code: ErrorCodeType
      readonly message: string | null | undefined
    })
export type PageResourceCacheEntryStateType = {
  readonly filePath: string
  readonly lastUpdate: Moment
  readonly hash: string
}
export type PageResourceCacheStateType = $ReadOnly<Record<string, PageResourceCacheEntryStateType>>
export type LanguageResourceCacheStateType = $ReadOnly<Record<string, PageResourceCacheStateType>>
export type ResourceCacheStateType =
  | {
      readonly status: 'error'
      readonly code: ErrorCodeType
      readonly message: string | null | undefined
    }
  | {
      readonly status: 'ready'
      readonly progress: number
      readonly value: LanguageResourceCacheStateType
    }
export type CityResourceCacheStateType = $ReadOnly<Record<string, LanguageResourceCacheStateType>>
export type CitiesStateType =
  | {
      readonly status: 'ready'
      readonly models: ReadonlyArray<CityModel>
    }
  | {
      readonly status: 'loading'
    }
  | {
      readonly status: 'error'
      readonly code: ErrorCodeType
      readonly message: string
    }
export const defaultCitiesState: CitiesStateType = {
  status: 'error',
  code: ErrorCodes.UnknownError,
  message: 'Cities not yet initialized'
}
export type LanguagesStateType =
  | {
      readonly status: 'ready'
      readonly models: ReadonlyArray<LanguageModel>
    }
  | {
      readonly status: 'loading'
    }
  | {
      readonly status: 'error'
      readonly code: ErrorCodeType
      readonly message: string
    }
export const defaultContentLanguageState = config.defaultFallback
export type SearchRouteType = {
  readonly categoriesMap: CategoriesMapModel
}
export type RouteStateType = CategoryRouteStateType | NewsRouteStateType | EventRouteStateType | PoiRouteStateType
export type RouteMappingType = $ReadOnly<Record<string, RouteStateType>>
export type CityContentStateType = {
  readonly city: string
  readonly switchingLanguage: boolean
  readonly languages: LanguagesStateType
  readonly routeMapping: RouteMappingType
  readonly resourceCache: ResourceCacheStateType
  readonly searchRoute: SearchRouteType | null
}
export const defaultCityContentState = null
export type SnackbarType = {
  text: string
}
export type SnackbarStateType = Array<SnackbarType>
export type StateType = {
  readonly snackbar: SnackbarStateType
  readonly darkMode: boolean
  readonly resourceCacheUrl: string | null
  readonly cityContent: CityContentStateType | null
  readonly contentLanguage: string
  readonly cities: CitiesStateType
}
