// @flow

import {
  CategoriesMapModel,
  CategoryModel,
  CityModel,
  EventModel,
  LanguageModel
} from '@integreat-app/integreat-api-client'
import Moment from 'moment'
import { DEFAULT_LANGUAGE } from '../i18n/components/I18nProvider'

export type PathType = string

export type CategoryRouteStateType = {|
  +root: string, // path of the root category
  +depth: number,
  +models: { [path: PathType]: CategoryModel }, /* Models could be stored outside of CategoryRouteStateType
                                                   (e.g. CategoriesStateType) to save memory
                                                   in the state. This would be an optimization! */
  +children: { [path: PathType]: Array<PathType> },
  +allAvailableLanguages: Map<string, string>, // including the current content language
  +language: string
|}

export type EventRouteStateType = {|
  +path: string | null,
  +models: Array<EventModel>,
  +allAvailableLanguages: Map<string, string>, // including the current content language
  +language: string
|}

export type FileCacheStateType = {
  [url: string]: {|
    filePath: string,
    lastUpdate: Moment,
    hash: string
  |}
}

export type ErrorStateType = {|
  +errorMessage: string
|}

export type LanguageResourceCacheStateType = {
  [path: string]: FileCacheStateType
} | ErrorStateType

export type CityResourceCacheStateType = {
  [language: string]: LanguageResourceCacheStateType
}

export type CategoriesRouteMappingType = {
  [key: string]: CategoryRouteStateType
} | ErrorStateType

export type EventsRouteMappingType = {
  [key: string]: EventRouteStateType
} | ErrorStateType

export type CitiesStateType = {|
  +models: Array<CityModel> | null
|} | ErrorStateType

export const defaultCitiesState: CitiesStateType = {
  models: null
}

export const defaultContentLanguageState = DEFAULT_LANGUAGE

export type SearchRouteType = {|
  +categoriesMap: CategoriesMapModel
|}

export type CityContentStateType = {|
  +city: string,
  +switchingLanguage: boolean,
  +languages: Array<LanguageModel>,
  +categoriesRouteMapping: CategoriesRouteMappingType,
  +eventsRouteMapping: EventsRouteMappingType,
  +resourceCache: LanguageResourceCacheStateType,
  +searchRoute: SearchRouteType | null
|}

export const defaultCityContentState = null
export type DirectionStateType = 'ltr' | 'rtl'

export type StateType = {|
  +uiDirection: DirectionStateType,
  +darkMode: boolean,

  +cityContent: CityContentStateType | null,
  +contentLanguage: string,
  +cities: CitiesStateType
|}
