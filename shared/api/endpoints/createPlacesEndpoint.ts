import { DateTime } from 'luxon'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import mapAvailableLanguages from '../mapping/mapAvailableLanguages'
import ContactModel from '../models/ContactModel'
import LocationModel from '../models/LocationModel'
import OpeningHoursModel from '../models/OpeningHoursModel'
import OrganizationModel from '../models/OrganizationModel'
import PlaceCategoryModel from '../models/PlaceCategoryModel'
import PlaceModel from '../models/PlaceModel'
import { JsonOpeningHoursType, JsonPlaceType } from '../types'

export const PLACES_ENDPOINT_NAME = 'places'
type ParamsType = {
  region: string
  language: string
}

const mapOpeningHours = (openingHours: JsonOpeningHoursType[] | null | undefined) =>
  openingHours?.map(
    openingHour =>
      new OpeningHoursModel({
        openAllDay: openingHour.allDay,
        closedAllDay: openingHour.closed,
        timeSlots: openingHour.timeSlots,
        appointmentOnly: openingHour.appointmentOnly,
      }),
  ) ?? null

export default (baseUrl: string): Endpoint<ParamsType, PlaceModel[]> =>
  new EndpointBuilder<ParamsType, PlaceModel[]>(PLACES_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${params.region}/${params.language}/locations/?on_map=1`,
    )
    .withMapper((json: JsonPlaceType[]): PlaceModel[] =>
      json.map(
        place =>
          new PlaceModel({
            path: place.path,
            title: place.title,
            content: place.content,
            thumbnail: place.thumbnail,
            availableLanguages: mapAvailableLanguages(place.available_languages),
            excerpt: place.excerpt,
            metaDescription: place.meta_description ? place.meta_description : null,
            contacts: place.contacts.map(
              contact =>
                new ContactModel({
                  name: contact.name,
                  areaOfResponsibility: contact.area_of_responsibility,
                  email: contact.email,
                  phoneNumber: contact.phone_number,
                  website: contact.website,
                  mobileNumber: contact.mobile_number,
                  officeHours: mapOpeningHours(contact.opening_hours),
                }),
            ),
            temporarilyClosed: place.temporarily_closed,
            openingHours: mapOpeningHours(place.opening_hours),
            appointmentUrl: place.appointment_url,
            category: new PlaceCategoryModel({
              id: place.category.id,
              name: place.category.name,
              color: place.category.color,
              iconName: place.category.icon,
              icon: place.category.icon_url,
            }),
            location: new LocationModel({
              id: place.location.id,
              name: place.location.name,
              address: place.location.address,
              town: place.location.town,
              postcode: place.location.postcode,
              country: place.location.country,
              latitude: place.location.latitude,
              longitude: place.location.longitude,
            }),
            lastUpdate: DateTime.fromISO(place.last_updated),
            organization:
              place.organization !== null
                ? new OrganizationModel({
                    name: place.organization.name,
                    url: place.organization.website,
                    logo: place.organization.logo,
                  })
                : null,
            barrierFree: place.barrier_free ?? null,
          }),
      ),
    )
    .build()
