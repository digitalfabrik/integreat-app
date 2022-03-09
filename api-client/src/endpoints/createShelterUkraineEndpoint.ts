import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import ShelterUkraineModel from '../models/ShelterUkraineModel'
import { JsonShelterUkraineJsonType } from '../types'

const SHELTER_UKRAINE_URL = 'https://wohnraum.tuerantuer.org/wp-json/accomodations/list'

export const SHELTER_UKRAINE_ENDPOINT_NAME = 'shelter-ukraine'
type Params = { type: 'detail'; id: string } | { type: 'list'; page: number }

export default (): Endpoint<Params, ShelterUkraineModel[]> =>
  new EndpointBuilder<Params, ShelterUkraineModel[]>(SHELTER_UKRAINE_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => {
      if (params.type === 'list') {
        return `${SHELTER_UKRAINE_URL}?page=${params.page}`
      }
      return SHELTER_UKRAINE_URL
    })
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
