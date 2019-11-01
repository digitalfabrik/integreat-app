// @flow

import {
  CategoriesMapModel,
  CategoryModel,
  CityModel,
  DateModel,
  EventModel,
  LanguageModel,
  LocationModel
} from '@integreat-app/integreat-api-client'
import RNFetchblob from 'rn-fetch-blob'
import type Moment from 'moment-timezone'
import moment from 'moment-timezone'
import type {
  CityResourceCacheStateType,
  LanguageResourceCacheStateType,
  PageResourceCacheEntryStateType,
  PageResourceCacheStateType
} from '../app/StateType'
import DatabaseContext from './DatabaseContext'
import { map, mapValues } from 'lodash'
import { CONTENT_VERSION, RESOURCE_CACHE_VERSION } from '../endpoint/persistentVersions'

// Our pdf view can only load from DocumentDir. Therefore we need to use that
export const CACHE_DIR_PATH = RNFetchblob.fs.dirs.DocumentDir
export const CONTENT_DIR_PATH = `${CACHE_DIR_PATH}/content/${CONTENT_VERSION}`
export const RESOURCE_CACHE_DIR_PATH = `${CACHE_DIR_PATH}/resource-cache/${RESOURCE_CACHE_VERSION}`

const MAX_RESOURCE_CACHES = 2

type ContentCategoryJsonType = {|
  root: string,
  path: string,
  title: string,
  content: string,
  last_update: string,
  thumbnail: string,
  available_languages: { [code: string]: string },
  parent_path: string,
  children: Array<string>,
  order: number,
  hash: string
|}

type ContentEventJsonType = {|
  path: string,
  title: string,
  content: string,
  last_update: string,
  thumbnail: string,
  available_languages: { [code: string]: string },
  hash: string,
  excerpt: string,
  date: {|
    start_date: string,
    end_date: string,
    all_day: boolean
  |},
  location: {|
    address: string,
    town: string,
    postcode: ?string,
    latitude: ?string,
    longitude: ?string
  |}
|}

type ContentCityJsonType = {|
  name: string,
  live: boolean,
  code: string,
  prefix: string,
  extras_enabled: boolean,
  events_enabled: boolean,
  sorting_name: string
|}

type CityCodeType = string
type LanguageCodeType = string

type MetaCitiesEntryJsonType = {|
  languages: {
    [LanguageCodeType]: {|
      last_update: string
    |}
  },
  last_usage: string | null
|}
type MetaCitiesJsonType = {
  [CityCodeType]: MetaCitiesEntryJsonType
}

type CityLastUsageType = {| city: CityCodeType, lastUsage: Moment | null |}

type PageResourceCacheEntryJsonType = {|
  file_path: string,
  last_update: string,
  hash: string
|}

type PageResourceCacheJsonType = {
  [url: string]: PageResourceCacheEntryJsonType
}

type LanguageResourceCacheJsonType = {
  [path: string]: PageResourceCacheJsonType
}
type CityResourceCacheJsonType = {
  [language: LanguageCodeType]: LanguageResourceCacheJsonType
}

const mapToObject = (map: Map<string, string>) => {
  const output = {}
  map.forEach((value, key) => { output[key] = value })
  return output
}

class DatabaseConnector {
  getContentPath (key: string, context: DatabaseContext): string {
    if (!key) {
      throw Error('Key mustn\'t be empty')
    } else if (!context.cityCode) {
      throw Error('cityCode mustn\'t be empty')
    }

    if (!context.languageCode) {
      return `${CONTENT_DIR_PATH}/${context.cityCode}/${key}.json`
    }

    return `${CONTENT_DIR_PATH}/${context.cityCode}/${context.languageCode}/${key}.json`
  }

  getResourceCachePath (context: DatabaseContext): string {
    if (!context.cityCode) {
      throw Error('cityCode mustn\'t be empty')
    }
    return `${RESOURCE_CACHE_DIR_PATH}/${context.cityCode}/files.json`
  }

  getMetaCitiesPath (): string {
    return `${CACHE_DIR_PATH}/cities-meta.json`
  }

  getCitiesPath (): string {
    return `${CACHE_DIR_PATH}/cities.json`
  }

  async storeLastUpdate (lastUpdate: Moment, context: DatabaseContext) {
    const cityCode = context.cityCode
    const languageCode = context.languageCode

    if (!cityCode) {
      throw Error('cityCode mustn\'t be empty')
    } else if (!languageCode) {
      throw Error('languageCode mustn\'t be empty')
    }

    const metaData = await this.loadMetaCities() || {}

    metaData[cityCode] = metaData[cityCode] || { languages: {}, last_usage: null }
    metaData[cityCode].languages[languageCode] = { last_update: lastUpdate.toISOString() }

    const path = this.getMetaCitiesPath()
    await this.writeFile(path, JSON.stringify(metaData))
  }

  async loadMetaCities (): Promise<MetaCitiesJsonType | null> {
    const path = this.getMetaCitiesPath()
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    return fileExists ? JSON.parse(await this.readFile(path)) : null
  }

  async loadLastUpdate (context: DatabaseContext): Promise<Moment | null> {
    const cityCode = context.cityCode
    const languageCode = context.languageCode

    if (!cityCode) {
      throw new Error('City is not set in DatabaseContext!')
    } else if (!languageCode) {
      throw new Error('Language is not set in DatabaseContext!')
    }

    const metaData = await this.loadMetaCities()
    if (!metaData) {
      return null
    }

    // eslint-disable-next-line camelcase
    const lastUpdate = metaData[cityCode]?.languages[languageCode]?.last_update
    return lastUpdate ? moment(lastUpdate, moment.ISO_8601) : null
  }

  async loadLastUsages (): Promise<Array<CityLastUsageType>> {
    const metaData = await this.loadMetaCities()
    if (!metaData) {
      return []
    }

    return map<MetaCitiesEntryJsonType, MetaCitiesJsonType, CityLastUsageType>(
      metaData, (value, key) => ({
        city: key,
        lastUsage: value.last_usage ? moment(value.last_usage, moment.ISO_8601) : null
      })
    )
  }

  async updateLastUsages (lastUsages: Array<CityLastUsageType>) {
    if (lastUsages.length === 0) {
      return
    }
    const metaData = await this.loadMetaCities() || {}

    lastUsages.forEach(lastUsage => {
      const city = lastUsage.city
      metaData[city] = { last_usage: lastUsage.lastUsage, languages: metaData[city].languages || {} }
    })

    this.writeFile(this.getMetaCitiesPath(), JSON.stringify(metaData))
  }

  async updateLastUsage (context: DatabaseContext) {
    if (!context.cityCode) {
      throw Error('cityCode mustn\'t be null')
    }
    await this.updateLastUsages([{ city: context.cityCode, lastUsage: moment().toISOString() }])
  }

  async storeCategories (categoriesMap: CategoriesMapModel, context: DatabaseContext) {
    const categoryModels = categoriesMap.toArray()

    const jsonModels = categoryModels.map((category: CategoryModel): ContentCategoryJsonType => ({
      root: category.isRoot(),
      path: category.path,
      title: category.title,
      content: category.content,
      last_update: category.lastUpdate.toISOString(),
      thumbnail: category.thumbnail,
      available_languages: mapToObject(category.availableLanguages),
      parent_path: category.parentPath,
      children: categoriesMap.getChildren(category).map(category => category.path),
      order: category.order,
      hash: category.hash
    }))

    await this.writeFile(this.getContentPath('categories', context), JSON.stringify(jsonModels))
  }

  async loadCategories (context: DatabaseContext): Promise<CategoriesMapModel> {
    const path = this.getContentPath('categories', context)
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const json = JSON.parse(await this.readFile(path))

    return new CategoriesMapModel(json.map((jsonObject: ContentCategoryJsonType) => {
      return new CategoryModel({
        root: jsonObject.root,
        path: jsonObject.path,
        title: jsonObject.title,
        content: jsonObject.content,
        thumbnail: jsonObject.thumbnail,
        parentPath: jsonObject.parent_path,
        order: jsonObject.order,
        availableLanguages: new Map(Object.entries(jsonObject.available_languages)),
        lastUpdate: moment(jsonObject.last_update, moment.ISO_8601),
        hash: jsonObject.hash
      })
    }))
  }

  async loadLanguages (context: DatabaseContext): Promise<Array<LanguageModel>> {
    const path = this.getContentPath('languages', context)
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const languages = JSON.parse(await this.readFile(path))
    return languages.map(language => new LanguageModel(language._code, language._name))
  }

  async storeLanguages (languages: Array<LanguageModel>, context: DatabaseContext) {
    const path = this.getContentPath('languages', context)
    await this.writeFile(path, JSON.stringify(languages))
  }

  async storeCities (cities: Array<CityModel>) {
    const jsonModels = cities.map((city: CityModel): ContentCityJsonType => ({
      name: city.name,
      live: city.live,
      code: city.code,
      prefix: city.prefix,
      extras_enabled: city.extrasEnabled,
      events_enabled: city.eventsEnabled,
      sorting_name: city.sortingName
    }))

    await this.writeFile(this.getCitiesPath(), JSON.stringify(jsonModels))
  }

  async loadCities (): Promise<Array<CityModel>> {
    const path = this.getCitiesPath()
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const json = JSON.parse(await this.readFile(path))

    return json.map((jsonObject: ContentCityJsonType) => {
      return new CityModel({
        name: jsonObject.name,
        code: jsonObject.code,
        live: jsonObject.live,
        eventsEnabled: jsonObject.events_enabled,
        extrasEnabled: jsonObject.extras_enabled,
        sortingName: jsonObject.sorting_name,
        prefix: jsonObject.prefix
      })
    })
  }

  async storeEvents (events: Array<EventModel>, context: DatabaseContext) {
    const jsonModels = events.map((event: EventModel): ContentEventJsonType => ({
      path: event.path,
      title: event.title,
      content: event.content,
      last_update: event.lastUpdate.toISOString(),
      thumbnail: event.thumbnail,
      available_languages: mapToObject(event.availableLanguages),
      hash: event.hash,
      excerpt: event.excerpt,
      date: {
        start_date: event.date.startDate.toISOString(),
        end_date: event.date.endDate.toISOString(),
        all_day: event.date.allDay
      },
      location: {
        address: event.location.address,
        town: event.location.town,
        postcode: event.location.postcode,
        latitude: event.location.latitude,
        longitude: event.location.longitude
      }
    }))

    await this.writeFile(this.getContentPath('events', context), JSON.stringify(jsonModels))
  }

  async loadEvents (context: DatabaseContext): Promise<Array<EventModel>> {
    const path = this.getContentPath('events', context)
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const json = JSON.parse(await this.readFile(path))

    return json.map((jsonObject: ContentEventJsonType) => {
      const jsonDate = jsonObject.date
      const jsonLocation = jsonObject.location
      return new EventModel({
        path: jsonObject.path,
        title: jsonObject.title,
        content: jsonObject.content,
        thumbnail: jsonObject.thumbnail,
        availableLanguages: new Map(Object.entries(jsonObject.available_languages)),
        lastUpdate: moment(jsonObject.last_update, moment.ISO_8601),
        hash: jsonObject.hash,
        excerpt: jsonObject.excerpt,
        date: new DateModel({
          startDate: moment(jsonDate.start_date, moment.ISO_8601),
          endDate: moment(jsonDate.end_date, moment.ISO_8601),
          allDay: jsonDate.all_day
        }),
        location: new LocationModel({
          address: jsonLocation.address,
          latitude: jsonLocation.latitude,
          longitude: jsonLocation.longitude,
          postcode: jsonLocation.postcode,
          town: jsonLocation.town
        })
      })
    })
  }

  async loadResourceCache (context: DatabaseContext): Promise<CityResourceCacheStateType> {
    const path = this.getResourceCachePath(context)
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    if (!fileExists) {
      return {}
    }

    const json: CityResourceCacheJsonType = JSON.parse(await this.readFile(path))

    return mapValues(json, (languageResourceCache: LanguageResourceCacheJsonType) =>
      mapValues(languageResourceCache, (fileResourceCache: PageResourceCacheJsonType) =>
        mapValues(fileResourceCache, (entry: PageResourceCacheEntryJsonType): PageResourceCacheEntryStateType => ({
          filePath: entry.file_path,
          lastUpdate: moment(entry.last_update, moment.ISO_8601),
          hash: entry.hash
        }))
      )
    )
  }

  async storeResourceCache (resourceCache: CityResourceCacheStateType, context: DatabaseContext) {
    await this.deleteOldResourceCaches(context)

    const path = this.getResourceCachePath(context)
    const json: CityResourceCacheJsonType =
      mapValues(resourceCache, (languageResourceCache: LanguageResourceCacheStateType) =>
        mapValues(languageResourceCache, (fileResourceCache: PageResourceCacheStateType) =>
          mapValues(fileResourceCache, (entry: PageResourceCacheEntryStateType): PageResourceCacheEntryJsonType => ({
            file_path: entry.filePath,
            last_update: entry.lastUpdate.toISOString(),
            hash: entry.hash
          }))
        )
      )
    await this.writeFile(path, JSON.stringify(json))
  }

  /**
   * Deletes the resource caches of all but the latest used cities
   * @return {Promise<void>}
   */
  async deleteOldResourceCaches (context: DatabaseContext) {
    if (!context.cityCode) {
      throw Error('cityCode mustn\'t be null')
    }
    const lastUsages: Array<{| city: CityCodeType, lastUsage: Moment |}> =
      (await this.loadLastUsages()).filter(it => it.lastUsage !== null && it.city !== context.cityCode)

    // Sort last usages chronological, from newest to oldest and remove the latest.
    const cachesToDelete = lastUsages.sort((a, b) =>
      a.lastUsage.isAfter(b.lastUsage) ? -1 : (a.lastUsage.isSame(b.lastUsage) ? 0 : 1)
    ).slice(MAX_RESOURCE_CACHES)

    await cachesToDelete.forEach(async cityLastUpdate => {
      const cityResourceCachePath = `${RESOURCE_CACHE_DIR_PATH}/${cityLastUpdate.city}`
      await this.deleteFileOrDirectory(cityResourceCachePath)
    })

    this.updateLastUsages(cachesToDelete.map(it => ({ city: it.city, lastUsage: null })))
  }

  isCitiesPersisted (): Promise<boolean> {
    return this.isPersisted(this.getCitiesPath())
  }

  isCategoriesPersisted (context: DatabaseContext): Promise<boolean> {
    return this.isPersisted(this.getContentPath('categories', context))
  }

  isLanguagesPersisted (context: DatabaseContext): Promise<boolean> {
    return this.isPersisted(this.getContentPath('languages', context))
  }

  isEventsPersisted (context: DatabaseContext): Promise<boolean> {
    return this.isPersisted(this.getContentPath('events', context))
  }

  isPersisted (path: string): Promise<boolean> {
    return RNFetchblob.fs.exists(path)
  }

  async readFile (path: string): Promise<string> {
    const jsonString: number[] | string = await RNFetchblob.fs.readFile(path, 'utf8')

    if (typeof jsonString !== 'string') {
      throw new Error('readFile did not return a string')
    }

    return jsonString
  }

  async writeFile (path: string, data: string): Promise<number> {
    return RNFetchblob.fs.writeFile(path, data, 'utf8')
  }

  async deleteFileOrDirectory (path: string): Promise<void> {
    return RNFetchblob.fs.unlink(path)
  }
}

export default DatabaseConnector
