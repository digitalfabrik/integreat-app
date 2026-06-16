import distance from '@turf/distance'
import { DateTime } from 'luxon'

import { GeoJsonPlace, LocationType } from '../../constants/map.js'
import isCurrentlyOpen from '../../utils/isCurrentlyOpen.js'
import ContactModel from './ContactModel.js'
import DocumentModel from './DocumentModel.js'
import ExtendedDocumentModel from './ExtendedDocumentModel.js'
import LocationModel from './LocationModel.js'
import OpeningHoursModel from './OpeningHoursModel.js'
import OrganizationModel from './OrganizationModel.js'
import PlaceCategoryModel from './PlaceCategoryModel.js'

class PlaceModel extends ExtendedDocumentModel {
  _location: LocationModel<number>
  _excerpt: string
  _metaDescription: string | null
  _openingHours: OpeningHoursModel[] | null
  _temporarilyClosed: boolean
  _category: PlaceCategoryModel
  _appointmentUrl: string | null
  _contacts: ContactModel[]
  _organization: OrganizationModel | null
  _barrierFree: boolean | null

  constructor(params: {
    path: string
    title: string
    content: string
    thumbnail: string | null
    availableLanguages: Record<string, string>
    metaDescription: string | null
    excerpt: string
    location: LocationModel<number>
    lastUpdate: DateTime
    temporarilyClosed: boolean
    openingHours: OpeningHoursModel[] | null
    category: PlaceCategoryModel
    appointmentUrl: string | null
    contacts: ContactModel[]
    organization: OrganizationModel | null
    barrierFree: boolean | null
  }) {
    const {
      category,
      openingHours,
      temporarilyClosed,
      location,
      excerpt,
      metaDescription,
      appointmentUrl,
      contacts,
      organization,
      barrierFree,
      ...other
    } = params
    super(other)
    this._location = location
    this._excerpt = excerpt
    this._metaDescription = metaDescription
    this._openingHours = openingHours
    this._temporarilyClosed = temporarilyClosed
    this._category = category
    this._appointmentUrl = appointmentUrl
    this._contacts = contacts
    this._organization = organization
    this._barrierFree = barrierFree
  }

  get location(): LocationModel<number> {
    return this._location
  }

  get excerpt(): string {
    return this._excerpt
  }

  get metaDescription(): string | null {
    return this._metaDescription
  }

  private getMarkerSymbol(): string {
    const { color, iconName } = this.category
    return `${iconName}_${color}`
  }

  getFeature(): GeoJsonPlace {
    return {
      id: this.location.id,
      title: this.title,
      symbol: this.getMarkerSymbol(),
      slug: this.slug,
    }
  }

  distance(location: LocationType): number {
    return distance(location, this.location.coordinates)
  }

  get openingHours(): OpeningHoursModel[] | null {
    return this._openingHours
  }

  get temporarilyClosed(): boolean {
    return this._temporarilyClosed
  }

  get appointmentUrl(): string | null {
    return this._appointmentUrl
  }

  get category(): PlaceCategoryModel {
    return this._category
  }

  get isCurrentlyOpen(): boolean {
    return isCurrentlyOpen(this.openingHours)
  }

  isEqual(other: DocumentModel): boolean {
    return (
      other instanceof PlaceModel &&
      super.isEqual(other) &&
      this.location.isEqual(other.location) &&
      this.excerpt === other.excerpt
    )
  }

  get contacts(): ContactModel[] {
    return this._contacts
  }

  get organization(): OrganizationModel | null {
    return this._organization
  }

  get barrierFree(): boolean | null {
    return this._barrierFree
  }
}

export default PlaceModel
