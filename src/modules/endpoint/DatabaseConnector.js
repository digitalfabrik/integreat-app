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
import { CACHE_DIR_PATH, CONTENT_DIR_PATH, RESOURCE_CACHE_DIR_PATH } from '../platform/constants/webview'
import { mapValues } from 'lodash'

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

type MetaCitiesJsonType = {
  [CityCodeType]: {|
    languages: {
      [LanguageCodeType]: {|
        last_update: string
      |}
    }
  |}
}

type MetaCitiesType = {
  [CityCodeType]: {|
    languages: {
      [LanguageCodeType]: {|
        lastUpdate: Moment
      |}
    }
  |}
}

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
    const citiesMeta = await this._loadMetaCities()
    citiesMeta[cityCode] = citiesMeta[cityCode] || { languages: {} }
    citiesMeta[cityCode].languages = {
      ...citiesMeta[cityCode].languages,
      [context.languageCode]: { lastUpdate }
    }

    await this._storeMetaCities(citiesMeta)
  }

  async loadLastUpdate (context: DatabaseContext): Promise<Moment | null> {
    const cityCode = context.cityCode
    const languageCode = context.languageCode

    if (!cityCode) {
      throw new Error('City is not set in DatabaseContext!')
    } else if (!languageCode) {
      throw new Error('Language is not set in DatabaseContext!')
    }

    const path = this.getMetaCitiesPath()
    const fileExists: boolean = await RNFetchblob.fs.exists(path)

    if (!fileExists) {
      return null
    }

    const citiesMeta = await this._loadMetaCities()
    return citiesMeta[cityCode]?.languages[languageCode]?.lastUpdate || null
  }

  async _loadMetaCities (): Promise<MetaCitiesType> {
    const path = this.getMetaCitiesPath()
    const fileExists: boolean = await RNFetchblob.fs.exists(path)
    if (fileExists) {
      try {
        const citiesMetaJson: MetaCitiesJsonType = JSON.parse(await this.readFile(path))
        return mapValues(citiesMetaJson, cityMeta => ({
          languages: mapValues(
            cityMeta.languages,
            ({ last_update: jsonLastUpdate }): {| lastUpdate: Moment |} =>
              ({ lastUpdate: moment(jsonLastUpdate, moment.ISO_8601) })
          )
        }))
      } catch (e) {
        console.error(e)
      }
    }
    return {}
  }

  async _storeMetaCities (metaCities: MetaCitiesType) {
    const path = this.getMetaCitiesPath()
    const citiesMetaJson: MetaCitiesJsonType = mapValues(metaCities, cityMeta => ({
      languages: mapValues(
        cityMeta.languages,
        ({ lastUpdate }): { last_update: string } => ({ last_update: lastUpdate.toISOString() })
      )
    }))
    await this.writeFile(path, JSON.stringify(citiesMetaJson))
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

  isCitiesPersisted (): Promise<boolean> {
    return this._isPersisted(this.getCitiesPath())
  }

  isCategoriesPersisted (context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('categories', context))
  }

  isLanguagesPersisted (context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('languages', context))
  }

  isEventsPersisted (context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('events', context))
  }

  _isPersisted (path: string): Promise<boolean> {
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
}

export default DatabaseConnector
