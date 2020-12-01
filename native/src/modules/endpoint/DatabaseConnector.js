// @flow

import {
  CategoriesMapModel,
  CategoryModel,
  CityModel,
  DateModel,
  EventModel, FeaturedImageModel,
  LanguageModel,
  LocationModel,
  PoiModel
} from 'api-client'
import RNFetchBlob from 'rn-fetch-blob'
import type Moment from 'moment'
import moment from 'moment'
import type {
  CityResourceCacheStateType,
  LanguageResourceCacheStateType,
  PageResourceCacheEntryStateType,
  PageResourceCacheStateType
} from '../app/StateType'
import DatabaseContext from './DatabaseContext'
import { map, mapValues } from 'lodash'
import { CONTENT_VERSION, RESOURCE_CACHE_VERSION } from './persistentVersions'
import deleteIfExists from './deleteIfExists'

// Our pdf view can only load from DocumentDir. Therefore we need to use that
export const CACHE_DIR_PATH = RNFetchBlob.fs.dirs.DocumentDir
export const CONTENT_DIR_PATH = `${CACHE_DIR_PATH}/content/${CONTENT_VERSION}`
export const RESOURCE_CACHE_DIR_PATH = `${CACHE_DIR_PATH}/resource-cache/${RESOURCE_CACHE_VERSION}`

const MAX_STORED_CITIES = 3

type ContentCategoryJsonType = {|
  root: boolean,
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

type LocationJsonType = {|
  address: ?string,
  town: ?string,
  postcode: ?string,
  latitude: ?string,
  longitude: ?string,
  country: ?string,
  region: ?string,
  state: ?string,
  name: ?string
|}

type FeaturedImageInstanceJsonType = {|
  url: string,
  width: number,
  height: number
|}

type FeaturedImageJsonType = {|
  description: ?string,
  thumbnail: FeaturedImageInstanceJsonType,
  medium: FeaturedImageInstanceJsonType,
  large: FeaturedImageInstanceJsonType,
  full: FeaturedImageInstanceJsonType
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
  location: LocationJsonType,
  featured_image: ?FeaturedImageJsonType
|}

type ContentCityJsonType = {|
  name: string,
  live: boolean,
  code: string,
  prefix: ?string,
  extras_enabled: boolean,
  events_enabled: boolean,
  pois_enabled: boolean,
  sorting_name: string,
  longitude: number | null,
  latitude: number | null,
  aliases: { [alias: string]: {|longitude: number, latitude: number|}} | null,
  pushNotificationsEnabled: boolean,
  tunewsEnabled: boolean
|}

type ContentPoiJsonType = {|
  path: string,
  title: string,
  content: string,
  thumbnail: string,
  availableLanguages: { [code: string]: string },
  excerpt: string,
  location: LocationJsonType,
  lastUpdate: string,
  hash: string
|}

type CityCodeType = string
type LanguageCodeType = string

type MetaCitiesEntryType = {|
  languages: {
    [LanguageCodeType]: {|
      lastUpdate: Moment
    |}
  },
  lastUsage: Moment
|}

type MetaCitiesJsonType = {
  [CityCodeType]: {|
    languages: {
      [LanguageCodeType]: {|
        last_update: string
      |}
    },
    last_usage: string
  |}
}

type CityLastUsageType = {| city: CityCodeType, lastUsage: Moment |}

type MetaCitiesType = { [CityCodeType]: MetaCitiesEntryType }

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

  async deleteAllFiles () {
    await RNFetchBlob.fs.unlink(CACHE_DIR_PATH)
  }

  /**
   * Prior to storing lastUpdate, there needs to be a lastUsage of the city.
   */
  async storeLastUpdate (lastUpdate: Moment | null, context: DatabaseContext) {
    if (lastUpdate === null) {
      throw Error('cannot set lastUsage to null')
    }
    const cityCode = context.cityCode
    const languageCode = context.languageCode

    if (!cityCode) {
      throw Error('cityCode mustn\'t be empty')
    } else if (!languageCode) {
      throw Error('languageCode mustn\'t be empty')
    }

    const metaData = await this._loadMetaCities() || {}

    if (!metaData[cityCode]) {
      throw Error('cannot store last update for unused city')
    }
    metaData[cityCode].languages[languageCode] = { lastUpdate }

    this._storeMetaCities(metaData)
  }

  async _deleteMetaOfCities (cities: Array<string>) {
    const metaCities = await this._loadMetaCities()
    cities.forEach(city => delete metaCities[city])
    await this._storeMetaCities(metaCities)
  }

  async loadLastUpdate (context: DatabaseContext): Promise<Moment | null> {
    const cityCode = context.cityCode
    const languageCode = context.languageCode

    if (!cityCode) {
      throw new Error('City is not set in DatabaseContext!')
    } else if (!languageCode) {
      throw new Error('Language is not set in DatabaseContext!')
    }

    const metaData = await this._loadMetaCities()
    return metaData[cityCode]?.languages[languageCode]?.lastUpdate || null
  }

  async _loadMetaCities (): Promise<MetaCitiesType> {
    const path = this.getMetaCitiesPath()
    const fileExists: boolean = await RNFetchBlob.fs.exists(path)
    if (fileExists) {
      try {
        const citiesMetaJson: MetaCitiesJsonType = JSON.parse(await this.readFile(path))
        return mapValues(citiesMetaJson, cityMeta => ({
          languages: mapValues(
            cityMeta.languages,
            ({ last_update: jsonLastUpdate }): {| lastUpdate: Moment |} =>
              ({ lastUpdate: moment(jsonLastUpdate, moment.ISO_8601) })
          ),
          lastUsage: moment(cityMeta.last_usage, moment.ISO_8601)
        }))
      } catch (e) {
        console.warn('An error occurred while loading cities from JSON', e)
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
      ),
      last_usage: cityMeta.lastUsage.toISOString()
    }))
    await this.writeFile(path, JSON.stringify(citiesMetaJson))
  }

  async loadLastUsages (): Promise<Array<CityLastUsageType>> {
    const metaData = await this._loadMetaCities()
    return map<MetaCitiesEntryType, MetaCitiesJsonType, CityLastUsageType>(
      metaData, (value, key) => ({
        city: key,
        lastUsage: value.lastUsage
      })
    )
  }

  async storeLastUsage (context: DatabaseContext, peeking: boolean) {
    const city = context.cityCode
    if (!city) {
      throw Error('cityCode mustn\'t be null')
    }

    const metaData = await this._loadMetaCities()

    metaData[city] = {
      lastUsage: moment(),
      languages: metaData[city]?.languages || {}
    }

    await this._storeMetaCities(metaData)

    // Only delete files if not peeking, otherwise if you peek from one city to three different cities, the content of
    // the non peeking city would be deleted while still open
    if (!peeking) {
      await this.deleteOldFiles(context)
    }
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
    const fileExists: boolean = await RNFetchBlob.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const json = JSON.parse(await this.readFile(path))

    return new CategoriesMapModel(json.map((jsonObject: ContentCategoryJsonType) => {
      // $FlowFixMe https://github.com/facebook/flow/issues/5838
      const availableLanguages = new Map<string, string>(Object.entries(jsonObject.available_languages))
      return new CategoryModel({
        root: jsonObject.root,
        path: jsonObject.path,
        title: jsonObject.title,
        content: jsonObject.content,
        thumbnail: jsonObject.thumbnail,
        parentPath: jsonObject.parent_path,
        order: jsonObject.order,
        availableLanguages,
        lastUpdate: moment(jsonObject.last_update, moment.ISO_8601),
        hash: jsonObject.hash
      })
    }))
  }

  async loadLanguages (context: DatabaseContext): Promise<Array<LanguageModel>> {
    const path = this.getContentPath('languages', context)
    const fileExists: boolean = await RNFetchBlob.fs.exists(path)

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

  async storePois (pois: Array<PoiModel>, context: DatabaseContext) {
    const jsonModels = pois.map((poi: PoiModel): ContentPoiJsonType => ({
      path: poi.path,
      title: poi.title,
      content: poi.content,
      thumbnail: poi.thumbnail,
      availableLanguages: mapToObject(poi.availableLanguages),
      excerpt: poi.excerpt,
      location: {
        address: poi.location.address,
        town: poi.location.town,
        postcode: poi.location.postcode,
        latitude: poi.location.latitude,
        longitude: poi.location.longitude,
        country: poi.location.country,
        region: poi.location.region,
        state: poi.location.state,
        name: poi.location.name
      },
      lastUpdate: poi.lastUpdate.toISOString(),
      hash: poi.hash
    }))
    await this.writeFile(this.getContentPath('pois', context), JSON.stringify(jsonModels))
  }

  async loadPois (context: DatabaseContext): Promise<Array<PoiModel>> {
    const path = this.getContentPath('pois', context)
    const fileExists: boolean = await RNFetchBlob.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const json = JSON.parse(await this.readFile(path))

    return json.map((jsonObject: ContentPoiJsonType) => {
      const jsonLocation = jsonObject.location
      // $FlowFixMe https://github.com/facebook/flow/issues/5838
      const availableLanguages = new Map<string, string>(Object.entries(jsonObject.availableLanguages))
      return new PoiModel({
        path: jsonObject.path,
        title: jsonObject.title,
        content: jsonObject.content,
        thumbnail: jsonObject.thumbnail,
        availableLanguages,
        excerpt: jsonObject.excerpt,
        location: new LocationModel({
          name: jsonLocation.name,
          region: jsonLocation.region,
          state: jsonLocation.state,
          country: jsonLocation.country,
          address: jsonLocation.address,
          latitude: jsonLocation.latitude,
          longitude: jsonLocation.longitude,
          postcode: jsonLocation.postcode,
          town: jsonLocation.town
        }),
        lastUpdate: moment(jsonObject.lastUpdate, moment.ISO_8601),
        hash: jsonObject.hash
      })
    })
  }

  async storeCities (cities: Array<CityModel>) {
    const jsonModels = cities.map((city: CityModel): ContentCityJsonType => ({
      name: city.name,
      live: city.live,
      code: city.code,
      prefix: city.prefix,
      extras_enabled: city.offersEnabled,
      events_enabled: city.eventsEnabled,
      pois_enabled: city.poisEnabled,
      pushNotificationsEnabled: city.pushNotificationsEnabled,
      tunewsEnabled: city.tunewsEnabled,
      sorting_name: city.sortingName,
      longitude: city.longitude,
      latitude: city.latitude,
      aliases: city.aliases
    }))

    await this.writeFile(this.getCitiesPath(), JSON.stringify(jsonModels))
  }

  async loadCities (): Promise<Array<CityModel>> {
    const path = this.getCitiesPath()
    const fileExists: boolean = await RNFetchBlob.fs.exists(path)

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
        pushNotificationsEnabled: jsonObject.pushNotificationsEnabled,
        tunewsEnabled: jsonObject.tunewsEnabled,
        offersEnabled: jsonObject.extras_enabled,
        poisEnabled: jsonObject.pois_enabled || false,
        sortingName: jsonObject.sorting_name,
        prefix: jsonObject.prefix,
        longitude: jsonObject.longitude,
        latitude: jsonObject.latitude,
        aliases: jsonObject.aliases
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
        longitude: event.location.longitude,
        country: event.location.country,
        region: event.location.region,
        state: event.location.state,
        name: event.location.name
      },
      featured_image: event.featuredImage
        ? {
          description: event.featuredImage.description,
          thumbnail: event.featuredImage.thumbnail,
          medium: event.featuredImage.medium,
          large: event.featuredImage.large,
          full: event.featuredImage.full
        }
        : null
    }))

    await this.writeFile(this.getContentPath('events', context), JSON.stringify(jsonModels))
  }

  async loadEvents (context: DatabaseContext): Promise<Array<EventModel>> {
    const path = this.getContentPath('events', context)
    const fileExists: boolean = await RNFetchBlob.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const json = JSON.parse(await this.readFile(path))

    return json.map((jsonObject: ContentEventJsonType) => {
      const jsonDate = jsonObject.date
      const jsonLocation = jsonObject.location
      // $FlowFixMe https://github.com/facebook/flow/issues/5838
      const availableLanguages = new Map<string, string>(Object.entries(jsonObject.available_languages))
      return new EventModel({
        path: jsonObject.path,
        title: jsonObject.title,
        content: jsonObject.content,
        thumbnail: jsonObject.thumbnail,
        featuredImage: jsonObject.featured_image
          ? new FeaturedImageModel({
            description: jsonObject.featured_image.description,
            thumbnail: jsonObject.featured_image.thumbnail,
            medium: jsonObject.featured_image.medium,
            large: jsonObject.featured_image.large,
            full: jsonObject.featured_image.full
          })
          : null,
        availableLanguages,
        lastUpdate: moment(jsonObject.last_update, moment.ISO_8601),
        hash: jsonObject.hash,
        excerpt: jsonObject.excerpt,
        date: new DateModel({
          startDate: moment(jsonDate.start_date, moment.ISO_8601),
          endDate: moment(jsonDate.end_date, moment.ISO_8601),
          allDay: jsonDate.all_day
        }),
        location: new LocationModel({
          name: jsonObject.location.name,
          region: jsonObject.location.region,
          state: jsonObject.location.state,
          country: jsonObject.location.country,
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
    const fileExists: boolean = await RNFetchBlob.fs.exists(path)

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

  /**
   * Deletes the resource caches and files of all but the latest used cities
   * @return {Promise<void>}
   */
  async deleteOldFiles (context: DatabaseContext) {
    const city = context.cityCode
    if (!city) {
      throw Error('cityCode mustn\'t be null')
    }
    const lastUsages = await this.loadLastUsages()
    const cachesToDelete = lastUsages.filter(it => it.city !== city)
      // Sort last usages chronological, from oldest to newest
      .sort((a, b) =>
        a.lastUsage.isBefore(b.lastUsage) ? -1 : (a.lastUsage.isSame(b.lastUsage) ? 0 : 1)
      )
      // We only have to remove MAX_STORED_CITIES - 1 since we already filtered for the current resource cache
      .slice(0, -(MAX_STORED_CITIES - 1))

    await Promise.all(cachesToDelete.map(cityLastUpdate => {
      const city = cityLastUpdate.city
      const cityResourceCachePath = `${RESOURCE_CACHE_DIR_PATH}/${city}`
      const cityContentPath = `${CONTENT_DIR_PATH}/${city}`

      return Promise.all([deleteIfExists(cityResourceCachePath), deleteIfExists(cityContentPath)])
    }))

    await this._deleteMetaOfCities(cachesToDelete.map(it => it.city))
  }

  isPoisPersisted (context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('pois', context))
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
    return RNFetchBlob.fs.exists(path)
  }

  async readFile (path: string): Promise<string> {
    const jsonString: number[] | string = await RNFetchBlob.fs.readFile(path, 'utf8')

    if (typeof jsonString !== 'string') {
      throw new Error('readFile did not return a string')
    }

    return jsonString
  }

  async writeFile (path: string, data: string): Promise<number> {
    return RNFetchBlob.fs.writeFile(path, data, 'utf8')
  }
}

export default DatabaseConnector
