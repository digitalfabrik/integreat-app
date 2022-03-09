import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import ShelterModel from '../models/ShelterModel'
import { JsonShelterType } from '../types'

const SHELTER_URL = 'https://wohnraum.tuerantuer.org/wp-json/accomodations/list'

export const SHELTER_ENDPOINT_NAME = 'shelter'
type Params = { type: 'detail'; id: string } | { type: 'list'; page: number }

export default (): Endpoint<Params, ShelterModel[]> =>
  new EndpointBuilder<Params, ShelterModel[]>(SHELTER_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => {
      if (params.type === 'list') {
        return `${SHELTER_URL}?page=${params.page}`
      }
      return SHELTER_URL
    })
    .withMapper((json: JsonShelterType[]): ShelterModel[] =>
      json.map(
        it =>
          new ShelterModel({
            id: it.id,
            name: it.name,
            quarter: it.quarter,
            city: it.city,
            zipcode: it.zipcode,
            languages: it.languages,
            beds: it.beds,
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
