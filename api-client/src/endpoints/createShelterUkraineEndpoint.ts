import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import ShelterUkraineModel from '../models/ShelterUkraineModel'
import { JsonShelterUkraineJsonType } from '../types'

const SHELTER_UKRAINE_URL = 'https://wohnraum.tuerantuer.org/wp-json/accomodations/list'

export const SHELTER_UKRAINE_ENDPOINT_NAME = 'shelter-ukraine'

export default (): Endpoint<void, ShelterUkraineModel[]> =>
  new EndpointBuilder<void, ShelterUkraineModel[]>(SHELTER_UKRAINE_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => SHELTER_UKRAINE_URL)
    .withMapper((json: JsonShelterUkraineJsonType[]): ShelterUkraineModel[] =>
      json.map(
        it =>
          new ShelterUkraineModel({
            id: it.id,
            name: it.name,
            quarter: it.quarter,
            city: it.city,
            zipcode: it.zipcode,
            languages: it.languages,
            accommodationType: it.accommodation_type,
            info: it.info,
            email: it.email,
            phone: it.phone,
            rooms: it.rooms,
            occupants: it.occupants,
            startDate: it.start_date,
            period: it.period,
            hostType: it.host_type
          })
      )
    )
    .build()
