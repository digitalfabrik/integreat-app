import { DateTime } from 'luxon'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import mapAvailableLanguages from '../mapping/mapAvailableLanguages'
import ContactModel from '../models/ContactModel'
import LocationModel from '../models/LocationModel'
import OpeningHoursModel from '../models/OpeningHoursModel'
import PoiCategoryModel from '../models/PoiCategoryModel'
import PoiModel from '../models/PoiModel'
import { JsonPoiType } from '../types'

export const POIS_ENDPOINT_NAME = 'pois'
type ParamsType = {
  city: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, PoiModel[]> =>
  new EndpointBuilder<ParamsType, PoiModel[]>(POIS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/locations/?on_map=1`,
    )
    .withMapper((json: JsonPoiType[]): PoiModel[] =>
      json.map(
        poi =>
          new PoiModel({
            path: poi.path,
            title: poi.title,
            content: poi.content,
            thumbnail: poi.thumbnail,
            availableLanguages: mapAvailableLanguages(poi.available_languages),
            excerpt: poi.excerpt,
            metaDescription: poi.meta_description ? poi.meta_description : null,
            contacts: poi.contacts.map(
              contact =>
                new ContactModel({
                  name: contact.name,
                  areaOfResponsibility: contact.area_of_responsibility,
                  email: contact.email,
                  phoneNumber: contact.phone_number,
                  website: contact.website,
                  mobilePhoneNumber: contact.mobile_phone_number,
                }),
            ),
            temporarilyClosed: poi.temporarily_closed,
            openingHours: poi.opening_hours?.map(openingHour => new OpeningHoursModel(openingHour)) ?? null,
            appointmentUrl: poi.appointment_url,
            category: new PoiCategoryModel({
              id: poi.category.id,
              name: poi.category.name,
              color: poi.category.color,
              iconName: poi.category.icon,
              icon: poi.category.icon_url,
            }),
            location: new LocationModel({
              id: poi.location.id,
              name: poi.location.name,
              address: poi.location.address,
              town: poi.location.town,
              postcode: poi.location.postcode,
              country: poi.location.country,
              latitude: poi.location.latitude,
              longitude: poi.location.longitude,
            }),
            lastUpdate: DateTime.fromISO(poi.last_updated),
          }),
      ),
    )
    .build()
