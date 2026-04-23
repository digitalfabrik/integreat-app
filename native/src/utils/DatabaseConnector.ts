import type { BBox } from 'geojson'
import { map, mapValues } from 'lodash'
import { DateTime } from 'luxon'
import BlobUtil from 'react-native-blob-util'
import { rrulestr } from 'rrule'

import {
  CategoriesMapModel,
  CategoryModel,
  RegionModel,
  ContactModel,
  DateModel,
  EventModel,
  FeaturedImageModel,
  LanguageModel,
  LocalNewsModel,
  LocationModel,
  OpeningHoursModel,
  PoiModel,
  PoiCategoryModel,
  OrganizationModel,
  OfferModel,
} from 'shared/api'

import DatabaseContext from '../models/DatabaseContext'
import { RegionResourceCacheStateType } from './DataContainer'
import { deleteIfExists } from './helpers'
import { log, reportError } from './sentry'

export const CONTENT_VERSION = 'v11'
export const RESOURCE_CACHE_VERSION = 'v3'

// Our pdf view can only load from DocumentDir. Therefore we need to use that
export const CACHE_DIR_PATH = BlobUtil.fs.dirs.DocumentDir
export const UNVERSIONED_CONTENT_DIR_PATH = `${CACHE_DIR_PATH}/content`
// Offline saved content like categories, events and pois
export const CONTENT_DIR_PATH = `${UNVERSIONED_CONTENT_DIR_PATH}/${CONTENT_VERSION}`
export const UNVERSIONED_RESOURCE_CACHE_DIR_PATH = `${CACHE_DIR_PATH}/resource-cache`
// Offline saved resources like pictures and pdf documents
export const RESOURCE_CACHE_DIR_PATH = `${UNVERSIONED_RESOURCE_CACHE_DIR_PATH}/${RESOURCE_CACHE_VERSION}`

const MAX_STORED_REGIONS = 3

type OrganizationJsonType = {
  name: string
  logo: string
  url: string
}

type ContentCategoryJsonType = {
  root: boolean
  path: string
  title: string
  content: string
  lastUpdate: string
  thumbnail: string | null
  availableLanguages: Record<string, string>
  parentPath: string
  children: string[]
  order: number
  organization: OrganizationJsonType | null
  embeddedOffers: OfferJsonType[]
}

type OfferJsonType = {
  alias: string
  title: string
  path: string
  thumbnail: string
}

type LocationJsonType<T> = {
  id: number
  address: string
  town: string
  postcode: string
  latitude: T
  longitude: T
  country: string
  name: string
}

type FeaturedImageInstanceJsonType = {
  url: string
  width: number
  height: number
}

type FeaturedImageJsonType = {
  description: string | null | undefined
  thumbnail: FeaturedImageInstanceJsonType
  medium: FeaturedImageInstanceJsonType
  large: FeaturedImageInstanceJsonType
  full: FeaturedImageInstanceJsonType
}

type ContentEventJsonType = {
  path: string
  title: string
  content: string
  lastUpdate: string
  thumbnail: string | null
  availableLanguages: Record<string, string>
  excerpt: string
  date: {
    start: string
    end: string | null
    allDay: boolean
    recurrenceRule: string | null
    onlyWeekdays: boolean
  }
  location: LocationJsonType<number | null> | null
  featuredImage: FeaturedImageJsonType | null | undefined
  poiPath: string | null
  meetingUrl: string | null
}

type ContentLanguageJsonType = {
  code: string
  name: string
}

type ContentRegionJsonType = {
  name: string
  live: boolean
  code: string
  languages: ContentLanguageJsonType[]
  prefix: string | null
  eventsEnabled: boolean
  chatEnabled: boolean
  chatPrivacyPolicyUrl: string | null
  poisEnabled: boolean
  sortingName: string
  longitude: number
  latitude: number
  aliases: Record<string, { longitude: number; latitude: number }> | null
  pushNotificationsEnabled: boolean
  tunewsEnabled: boolean
  boundingBox: BBox
}

type ContactJsonType = {
  name: string | null
  areaOfResponsibility: string | null
  email: string | null
  phoneNumber: string | null
  website: string | null
  mobileNumber: string | null
  officeHours:
    | {
        openAllDay: boolean
        closedAllDay: boolean
        timeSlots: { start: string; end: string }[]
        appointmentOnly: boolean
      }[]
    | null
}

type ContentPoiJsonType = {
  path: string
  title: string
  content: string
  thumbnail: string | null
  contacts: ContactJsonType[]
  availableLanguages: Record<string, string>
  excerpt: string
  location: LocationJsonType<number>
  lastUpdate: string
  category: { id: number; name: string; color: string; icon: string; iconName: string }
  openingHours:
    | {
        openAllDay: boolean
        closedAllDay: boolean
        timeSlots: { start: string; end: string; timezone?: string }[]
        appointmentOnly: boolean
      }[]
    | null
  temporarilyClosed: boolean
  appointmentUrl: string | null
  organization: OrganizationJsonType | null
  barrierFree: boolean | null
}

type ContentLocalNewsJsonType = {
  id: number
  timestamp: string
  title: string
  content: string
  availableLanguages: Record<string, number> | undefined
}

type RegionCodeType = string

type LanguageCodeType = string

type MetaRegionsEntryType = {
  languages: Record<
    LanguageCodeType,
    {
      lastUpdate: DateTime
    }
  >
  lastUsage: DateTime
}

type MetaRegionsJsonType = Record<
  RegionCodeType,
  {
    languages: Record<
      LanguageCodeType,
      {
        lastUpdate: string
      }
    >
    lastUsage: string
  }
>

type RegionLastUsageType = {
  region: RegionCodeType
  lastUsage: DateTime
}

type MetaRegionsType = Record<RegionCodeType, MetaRegionsEntryType>

const mapOpeningHoursToJson = (
  hours: OpeningHoursModel,
): {
  openAllDay: boolean
  closedAllDay: boolean
  timeSlots: { start: string; end: string; timezone: string | undefined }[]
  appointmentOnly: boolean
} => ({
  openAllDay: hours.openAllDay,
  closedAllDay: hours.closedAllDay,
  timeSlots: hours.timeSlots.map(timeslot => ({
    start: timeslot.start,
    end: timeslot.end,
    timezone: timeslot.timezone ?? undefined,
  })),
  appointmentOnly: hours.appointmentOnly,
})

const mapJsonToOpeningHours = (hours: {
  openAllDay: boolean
  closedAllDay: boolean
  timeSlots: { start: string; end: string; timezone?: string }[]
  appointmentOnly: boolean
}): OpeningHoursModel =>
  new OpeningHoursModel({
    openAllDay: hours.openAllDay,
    closedAllDay: hours.closedAllDay,
    timeSlots: hours.timeSlots.map(timeslot => ({
      start: timeslot.start,
      end: timeslot.end,
      timezone: timeslot.timezone ?? undefined,
    })),
    appointmentOnly: hours.appointmentOnly,
  })

class DatabaseConnector {
  constructor() {
    this.migrationRoutine().catch(reportError)
  }

  async migrationRoutine(): Promise<void> {
    const contentDirExists = await BlobUtil.fs.isDir(CONTENT_DIR_PATH)
    const baseContentDirExists = await BlobUtil.fs.isDir(UNVERSIONED_CONTENT_DIR_PATH)
    const resourceCacheDirExists = await BlobUtil.fs.isDir(RESOURCE_CACHE_DIR_PATH)
    const baseResourceCacheDirExists = await BlobUtil.fs.isDir(UNVERSIONED_RESOURCE_CACHE_DIR_PATH)

    // Delete old content if version is upgraded (if the base dir exists but the current content doesn't, the old content is still there)
    if (!contentDirExists && baseContentDirExists) {
      await BlobUtil.fs.unlink(UNVERSIONED_CONTENT_DIR_PATH)
    }

    // Delete old resource cache if version is upgraded (if the base dir exists but the current resource cache doesn't, the old resource cache is still there)
    if (!resourceCacheDirExists && baseResourceCacheDirExists) {
      await BlobUtil.fs.unlink(UNVERSIONED_RESOURCE_CACHE_DIR_PATH)
    }
  }

  getContentPath(key: string, context: DatabaseContext): string {
    if (!key) {
      throw Error("Key mustn't be empty")
    } else if (!context.regionCode) {
      throw Error("regionCode mustn't be empty")
    }

    if (!context.languageCode) {
      return `${CONTENT_DIR_PATH}/${context.regionCode}/${key}.json`
    }

    return `${CONTENT_DIR_PATH}/${context.regionCode}/${context.languageCode}/${key}.json`
  }

  getResourceCachePath(context: DatabaseContext): string {
    if (!context.regionCode) {
      throw Error("regionCode mustn't be empty")
    }

    return `${RESOURCE_CACHE_DIR_PATH}/${context.regionCode}/files.json`
  }

  getMetaRegionsPath(): string {
    return `${CACHE_DIR_PATH}/regions-meta.json`
  }

  getRegionsPath(): string {
    return `${CACHE_DIR_PATH}/regions.json`
  }

  async deleteAllFiles(): Promise<void> {
    await BlobUtil.fs.unlink(CACHE_DIR_PATH)
  }

  async storeLastUpdate(lastUpdate: DateTime | null, context: DatabaseContext): Promise<void> {
    if (lastUpdate === null) {
      // Prior to storing lastUpdate, there needs to be a lastUsage of the region.
      throw Error('cannot set lastUsage to null')
    }

    const { regionCode, languageCode } = context

    if (!regionCode) {
      throw Error("regionCode mustn't be empty")
    } else if (!languageCode) {
      throw Error("languageCode mustn't be empty")
    }

    const metaData = await this._loadMetaRegions()
    const regionMetaData = metaData[regionCode]

    if (!regionMetaData) {
      log(`Did not find region '${regionCode}' im metaData '${JSON.stringify(metaData)}'`, { level: 'warning' })
      throw Error('cannot store last update for unused region')
    }

    regionMetaData.languages[languageCode] = {
      lastUpdate,
    }

    this._storeMetaRegions(metaData)
  }

  async _deleteMetaOfRegions(regions: string[]): Promise<void> {
    const metaRegions = await this._loadMetaRegions()
    regions.forEach(region => delete metaRegions[region])
    await this._storeMetaRegions(metaRegions)
  }

  async loadLastUpdate(context: DatabaseContext): Promise<DateTime | null> {
    const { regionCode } = context
    const { languageCode } = context

    if (!regionCode) {
      throw new Error('Region is not set in DatabaseContext!')
    } else if (!languageCode) {
      throw new Error('Language is not set in DatabaseContext!')
    }

    const metaData = await this._loadMetaRegions()
    return metaData[regionCode]?.languages[languageCode]?.lastUpdate || null
  }

  async _loadMetaRegions(): Promise<MetaRegionsType> {
    const path = this.getMetaRegionsPath()
    const fileExists = await BlobUtil.fs.exists(path)

    if (!fileExists) {
      return {}
    }

    const mapRegionsMetaJson = (json: MetaRegionsJsonType) =>
      mapValues(json, regionMeta => ({
        languages: mapValues(
          regionMeta.languages,
          ({
            lastUpdate: jsonLastUpdate,
          }): {
            lastUpdate: DateTime
          } => ({
            lastUpdate: DateTime.fromISO(jsonLastUpdate),
          }),
        ),
        lastUsage: DateTime.fromISO(regionMeta.lastUsage),
      }))
    return this.readFile(path, mapRegionsMetaJson)
  }

  async _storeMetaRegions(metaRegions: MetaRegionsType): Promise<void> {
    const path = this.getMetaRegionsPath()
    const regionsMetaJson: MetaRegionsJsonType = mapValues(metaRegions, regionMeta => ({
      languages: mapValues(
        regionMeta.languages,
        ({
          lastUpdate,
        }): {
          lastUpdate: string
        } => ({
          lastUpdate: lastUpdate.toISO(),
        }),
      ),
      lastUsage: regionMeta.lastUsage.toISO(),
    }))
    await this.writeFile(path, JSON.stringify(regionsMetaJson))
  }

  async loadLastUsages(): Promise<RegionLastUsageType[]> {
    const metaData = await this._loadMetaRegions()
    return map<MetaRegionsType, RegionLastUsageType>(metaData, (value, key) => ({
      region: key,
      lastUsage: value.lastUsage,
    }))
  }

  async storeLastUsage(context: DatabaseContext): Promise<void> {
    const region = context.regionCode

    if (!region) {
      throw Error("regionCode mustn't be null")
    }

    const metaData = await this._loadMetaRegions().catch(() => ({}) as MetaRegionsType)
    metaData[region] = {
      lastUsage: DateTime.now(),
      languages: metaData[region]?.languages || {},
    }
    await this._storeMetaRegions(metaData)
    await this.deleteOldFiles(context)
  }

  async storeCategories(categoriesMap: CategoriesMapModel, context: DatabaseContext): Promise<void> {
    const categoryModels = categoriesMap.toArray()
    const jsonModels = categoryModels.map(
      (category: CategoryModel): ContentCategoryJsonType => ({
        root: category.isRoot(),
        path: category.path,
        title: category.title,
        content: category.content,
        lastUpdate: category.lastUpdate.toISO(),
        thumbnail: category.thumbnail,
        availableLanguages: category.availableLanguages,
        parentPath: category.parentPath,
        children: categoriesMap.getChildren(category).map(category => category.path),
        order: category.order,
        organization: category.organization
          ? {
              name: category.organization.name,
              logo: category.organization.logo,
              url: category.organization.url,
            }
          : null,
        embeddedOffers: category.embeddedOffers.map(offer => ({
          title: offer.title,
          alias: offer.alias,
          thumbnail: offer.thumbnail,
          path: offer.path,
        })),
      }),
    )
    await this.writeFile(this.getContentPath('categories', context), JSON.stringify(jsonModels))
  }

  async loadCategories(context: DatabaseContext): Promise<CategoriesMapModel> {
    const path = this.getContentPath('categories', context)
    const mapCategoriesJson = (json: ContentCategoryJsonType[]) =>
      new CategoriesMapModel(
        json.map(
          jsonObject =>
            new CategoryModel({
              root: jsonObject.root,
              path: jsonObject.path,
              title: jsonObject.title,
              content: jsonObject.content,
              thumbnail: jsonObject.thumbnail,
              parentPath: jsonObject.parentPath,
              order: jsonObject.order,
              availableLanguages: jsonObject.availableLanguages,
              lastUpdate: DateTime.fromISO(jsonObject.lastUpdate),
              organization:
                jsonObject.organization !== null
                  ? new OrganizationModel({
                      name: jsonObject.organization.name,
                      logo: jsonObject.organization.logo,
                      url: jsonObject.organization.url,
                    })
                  : null,
              embeddedOffers: jsonObject.embeddedOffers.map(
                jsonOffer =>
                  new OfferModel({
                    title: jsonOffer.title,
                    alias: jsonOffer.alias,
                    thumbnail: jsonOffer.thumbnail,
                    path: jsonOffer.path,
                  }),
              ),
            }),
        ),
      )

    return this.readFile(path, mapCategoriesJson)
  }

  async storePois(pois: PoiModel[], context: DatabaseContext): Promise<void> {
    const jsonModels = pois.map(
      (poi: PoiModel): ContentPoiJsonType => ({
        path: poi.path,
        title: poi.title,
        content: poi.content,
        thumbnail: poi.thumbnail,
        availableLanguages: poi.availableLanguages,
        excerpt: poi.excerpt,
        contacts: poi.contacts.map(contact => ({
          name: contact.name,
          areaOfResponsibility: contact.areaOfResponsibility,
          email: contact.email,
          phoneNumber: contact.phoneNumber,
          website: contact.website,
          mobileNumber: contact.mobileNumber,
          officeHours: contact.officeHours?.map(mapOpeningHoursToJson) ?? null,
        })),
        location: {
          id: poi.location.id,
          address: poi.location.address,
          town: poi.location.town,
          postcode: poi.location.postcode,
          latitude: poi.location.latitude,
          longitude: poi.location.longitude,
          country: poi.location.country,
          name: poi.location.name,
        },
        lastUpdate: poi.lastUpdate.toISO(),
        category: {
          id: poi.category.id,
          name: poi.category.name,
          icon: poi.category.icon,
          iconName: poi.category.iconName,
          color: poi.category.color,
        },
        openingHours: poi.openingHours?.map(mapOpeningHoursToJson) ?? null,
        temporarilyClosed: poi.temporarilyClosed,
        appointmentUrl: poi.appointmentUrl,
        organization:
          poi.organization !== null
            ? {
                name: poi.organization.name,
                logo: poi.organization.logo,
                url: poi.organization.url,
              }
            : null,
        barrierFree: poi.barrierFree ?? null,
      }),
    )
    await this.writeFile(this.getContentPath('pois', context), JSON.stringify(jsonModels))
  }

  async loadPois(context: DatabaseContext): Promise<PoiModel[]> {
    const path = this.getContentPath('pois', context)
    const mapPoisJson = (json: ContentPoiJsonType[]) =>
      json.map(jsonObject => {
        const jsonLocation = jsonObject.location
        return new PoiModel({
          path: jsonObject.path,
          title: jsonObject.title,
          content: jsonObject.content,
          thumbnail: jsonObject.thumbnail,
          availableLanguages: jsonObject.availableLanguages,
          metaDescription: null, // not used in native
          excerpt: jsonObject.excerpt,
          contacts: jsonObject.contacts.map(
            contact =>
              new ContactModel({
                name: contact.name,
                areaOfResponsibility: contact.areaOfResponsibility,
                email: contact.email,
                phoneNumber: contact.phoneNumber,
                website: contact.website,
                mobileNumber: contact.mobileNumber,
                officeHours: contact.officeHours?.map(mapJsonToOpeningHours) ?? null,
              }),
          ),
          location: new LocationModel({
            id: jsonLocation.id,
            name: jsonLocation.name,
            country: jsonLocation.country,
            address: jsonLocation.address,
            latitude: jsonLocation.latitude,
            longitude: jsonLocation.longitude,
            postcode: jsonLocation.postcode,
            town: jsonLocation.town,
          }),
          lastUpdate: DateTime.fromISO(jsonObject.lastUpdate),
          category: new PoiCategoryModel({
            id: jsonObject.category.id,
            name: jsonObject.category.name,
            color: jsonObject.category.color,
            icon: jsonObject.category.icon,
            iconName: jsonObject.category.iconName,
          }),
          openingHours: jsonObject.openingHours?.map(mapJsonToOpeningHours) ?? null,
          temporarilyClosed: jsonObject.temporarilyClosed,
          appointmentUrl: jsonObject.appointmentUrl,
          organization:
            jsonObject.organization !== null
              ? new OrganizationModel({
                  name: jsonObject.organization.name,
                  logo: jsonObject.organization.logo,
                  url: jsonObject.organization.url,
                })
              : null,
          barrierFree: jsonObject.barrierFree ?? null,
        })
      })

    return this.readFile(path, mapPoisJson)
  }

  async storeLocalNews(localNews: LocalNewsModel[], context: DatabaseContext): Promise<void> {
    const jsonModels = localNews.map(
      (it: LocalNewsModel): ContentLocalNewsJsonType => ({
        id: it.id,
        timestamp: it.timestamp.toISO(),
        title: it.title,
        content: it.content,
        availableLanguages: it.availableLanguages,
      }),
    )
    await this.writeFile(this.getContentPath('localNews', context), JSON.stringify(jsonModels))
  }

  async loadLocalNews(context: DatabaseContext): Promise<LocalNewsModel[]> {
    const path = this.getContentPath('localNews', context)
    const mapLocalNewsJson = (json: ContentLocalNewsJsonType[]) =>
      json.map(
        jsonObject =>
          new LocalNewsModel({
            id: jsonObject.id,
            timestamp: DateTime.fromISO(jsonObject.timestamp),
            title: jsonObject.title,
            content: jsonObject.content,
            availableLanguages: jsonObject.availableLanguages ?? {},
          }),
      )

    return this.readFile(path, mapLocalNewsJson)
  }

  async storeRegions(regions: RegionModel[]): Promise<void> {
    const jsonModels = regions.map(
      (region: RegionModel): ContentRegionJsonType => ({
        name: region.name,
        live: region.live,
        code: region.code,
        languages: region.languages.map(it => ({ code: it.code, name: it.name })),
        prefix: region.prefix,
        eventsEnabled: region.eventsEnabled,
        chatEnabled: region.chatEnabled,
        chatPrivacyPolicyUrl: region.chatPrivacyPolicyUrl,
        poisEnabled: region.poisEnabled,
        pushNotificationsEnabled: region.localNewsEnabled,
        tunewsEnabled: region.tunewsEnabled,
        sortingName: region.sortingName,
        longitude: region.longitude,
        latitude: region.latitude,
        aliases: region.aliases,
        boundingBox: region.boundingBox,
      }),
    )
    await this.writeFile(this.getRegionsPath(), JSON.stringify(jsonModels))
  }

  async loadRegions(): Promise<RegionModel[]> {
    const path = this.getRegionsPath()
    const mapRegionJson = (json: ContentRegionJsonType[]) =>
      json.map(
        jsonObject =>
          new RegionModel({
            name: jsonObject.name,
            code: jsonObject.code,
            live: jsonObject.live,
            languages: jsonObject.languages.map(it => new LanguageModel(it.code, it.name)),
            eventsEnabled: jsonObject.eventsEnabled,
            localNewsEnabled: jsonObject.pushNotificationsEnabled,
            tunewsEnabled: jsonObject.tunewsEnabled,
            poisEnabled: jsonObject.poisEnabled,
            sortingName: jsonObject.sortingName,
            prefix: jsonObject.prefix,
            longitude: jsonObject.longitude,
            latitude: jsonObject.latitude,
            aliases: jsonObject.aliases,
            boundingBox: jsonObject.boundingBox,
            chatEnabled: jsonObject.chatEnabled,
            chatPrivacyPolicyUrl: jsonObject.chatPrivacyPolicyUrl,
          }),
      )

    return this.readFile(path, mapRegionJson)
  }

  async storeEvents(events: EventModel[], context: DatabaseContext): Promise<void> {
    const jsonModels = events.map(
      (event: EventModel): ContentEventJsonType => ({
        path: event.path,
        title: event.title,
        content: event.content,
        lastUpdate: event.lastUpdate.toISO(),
        thumbnail: event.thumbnail,
        availableLanguages: event.availableLanguages,
        excerpt: event.excerpt,
        date: {
          start: event.date.startDate.toISO(),
          end: event.date.endDate ? event.date.endDate.toISO() : null,
          allDay: event.date.allDay,
          recurrenceRule: event.date.recurrenceRule?.toString() ?? null,
          onlyWeekdays: event.date.onlyWeekdays,
        },
        location: event.location
          ? {
              id: event.location.id,
              address: event.location.address,
              town: event.location.town,
              postcode: event.location.postcode,
              latitude: event.location.latitude,
              longitude: event.location.longitude,
              country: event.location.country,
              name: event.location.name,
            }
          : null,
        featuredImage: event.featuredImage
          ? {
              description: event.featuredImage.description,
              thumbnail: event.featuredImage.thumbnail,
              medium: event.featuredImage.medium,
              large: event.featuredImage.large,
              full: event.featuredImage.full,
            }
          : null,
        poiPath: event.poiPath,
        meetingUrl: event.meetingUrl,
      }),
    )
    await this.writeFile(this.getContentPath('events', context), JSON.stringify(jsonModels))
  }

  async loadEvents(context: DatabaseContext): Promise<EventModel[]> {
    const path = this.getContentPath('events', context)
    const mapEventsJson = (json: ContentEventJsonType[]) =>
      json.map(jsonObject => {
        const jsonDate = jsonObject.date
        return new EventModel({
          path: jsonObject.path,
          title: jsonObject.title,
          content: jsonObject.content,
          thumbnail: jsonObject.thumbnail,
          featuredImage: jsonObject.featuredImage
            ? new FeaturedImageModel({
                description: jsonObject.featuredImage.description,
                thumbnail: jsonObject.featuredImage.thumbnail,
                medium: jsonObject.featuredImage.medium,
                large: jsonObject.featuredImage.large,
                full: jsonObject.featuredImage.full,
              })
            : null,
          availableLanguages: jsonObject.availableLanguages,
          lastUpdate: DateTime.fromISO(jsonObject.lastUpdate),
          excerpt: jsonObject.excerpt,
          date: new DateModel({
            startDate: DateTime.fromISO(jsonDate.start),
            endDate: jsonDate.end ? DateTime.fromISO(jsonDate.end) : null,
            allDay: jsonDate.allDay,
            recurrenceRule: jsonDate.recurrenceRule ? rrulestr(jsonDate.recurrenceRule) : null,
            onlyWeekdays: jsonDate.onlyWeekdays,
          }),
          location: jsonObject.location
            ? new LocationModel({
                id: jsonObject.location.id,
                name: jsonObject.location.name,
                country: jsonObject.location.country,
                address: jsonObject.location.address,
                latitude: jsonObject.location.latitude,
                longitude: jsonObject.location.longitude,
                postcode: jsonObject.location.postcode,
                town: jsonObject.location.town,
              })
            : null,
          poiPath: jsonObject.poiPath,
          meetingUrl: jsonObject.meetingUrl,
        })
      })

    return this.readFile(path, mapEventsJson)
  }

  async loadResourceCache(context: DatabaseContext): Promise<RegionResourceCacheStateType> {
    const path = this.getResourceCachePath(context)
    const fileExists: boolean = await BlobUtil.fs.exists(path)

    if (!fileExists) {
      return {}
    }

    const mapResourceCacheJson = (json: RegionResourceCacheStateType) => json
    return this.readFile(path, mapResourceCacheJson)
  }

  async storeResourceCache(resourceCache: RegionResourceCacheStateType, context: DatabaseContext): Promise<void> {
    const path = this.getResourceCachePath(context)
    await this.writeFile(path, JSON.stringify(resourceCache))
  }

  /**
   * Deletes the resource caches and files of all but the latest used regions
   * @return {Promise<void>}
   */
  async deleteOldFiles(context: DatabaseContext): Promise<void> {
    const region = context.regionCode

    if (!region) {
      throw Error("regionCode mustn't be null")
    }

    const lastUsages = await this.loadLastUsages()
    const cachesToDelete = lastUsages
      .filter(it => it.region !== region) // Sort last usages chronological, from oldest to newest
      .sort((a, b) => {
        if (a.lastUsage < b.lastUsage) {
          return -1
        }
        return a.lastUsage.equals(b.lastUsage) ? 0 : 1
      }) // We only have to remove MAX_STORED_REGIONS - 1 since we already filtered for the current resource cache
      .slice(0, -(MAX_STORED_REGIONS - 1))
    await this.deleteRegions(cachesToDelete.map(it => it.region))
  }

  async deleteRegions(regionCodes: string[]): Promise<void> {
    await Promise.all([
      ...regionCodes.map(region => {
        log(`Deleting content and resource cache of region '${region}'`)
        const regionResourceCachePath = `${RESOURCE_CACHE_DIR_PATH}/${region}`
        const regionContentPath = `${CONTENT_DIR_PATH}/${region}`
        return Promise.all([deleteIfExists(regionResourceCachePath), deleteIfExists(regionContentPath)])
      }),
      this._deleteMetaOfRegions(regionCodes),
    ])
  }

  isPoisPersisted(context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('pois', context))
  }

  isRegionsPersisted(): Promise<boolean> {
    return this._isPersisted(this.getRegionsPath())
  }

  isCategoriesPersisted(context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('categories', context))
  }

  isEventsPersisted(context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('events', context))
  }

  isLocalNewsPersisted(context: DatabaseContext): Promise<boolean> {
    return this._isPersisted(this.getContentPath('localNews', context))
  }

  _isPersisted(path: string): Promise<boolean> {
    return BlobUtil.fs.exists(path)
  }

  async readFile<R, T>(path: string, mapJson: (json: R) => T, isRetry = false): Promise<T> {
    const fileExists = await BlobUtil.fs.exists(path)

    if (!fileExists) {
      throw Error(`File ${path} does not exist`)
    }

    const jsonString = await BlobUtil.fs.readFile(path, 'utf8')

    try {
      const json: R = JSON.parse(jsonString)
      return mapJson(json)
    } catch (e) {
      if (!isRetry) {
        log(`An error occurred while trying to parse or map json '${jsonString}' from path '${path}', retrying.`, {
          level: 'warning',
        })
        return this.readFile(path, mapJson, true)
      }
      log(`An error occurred while trying to parse or map json '${jsonString}' from path '${path}', deleting file.`, {
        level: 'warning',
      })
      await deleteIfExists(path)
      throw e
    }
  }

  async writeFile(path: string, data: string): Promise<void> {
    return BlobUtil.fs.writeFile(path, data, 'utf8')
  }
}

export default DatabaseConnector
