import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import ShelterModel from '../models/ShelterModel'
import { JsonShelterType } from '../types'

const SHELTER_URL = 'wohnraum.tuerantuer.org/wp-json/accommodations'

export const SHELTER_ENDPOINT_NAME = 'shelter'
type Params =
  | { type: 'detail'; id: string; cityCode: string }
  | { type: 'list'; page: number; cityCode: string; filter?: FilterProps }

export type FilterProps = {
  beds: string | null
}

// Map for the filter keys for the endpoint
const paramMap = new Map([['beds', 'min_beds']])

const getFilterQueryParams = (params: FilterProps): string =>
  Object.keys(params)
    .map((key: string) => {
      if (params[key as keyof FilterProps]) {
        return `&${paramMap.get(key)}=${params[key as keyof FilterProps]}`
      }
      return ''
    })
    .join('')

export default (): Endpoint<Params, ShelterModel[]> =>
  new EndpointBuilder<Params, ShelterModel[]>(SHELTER_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => {
      const baseUrl = `https://${params.cityCode}.${SHELTER_URL}`
      if (params.type === 'list') {
        const filterParams = params.filter ? `${getFilterQueryParams(params.filter)}` : ''
        return `${baseUrl}/list?page=${params.page}${filterParams}`
      }
      return `${baseUrl}/${params.id}`
    })
    .withMapper((json: JsonShelterType[]): ShelterModel[] =>
      json.map(
        it =>
          new ShelterModel({
            id: it.id,
            name: it.name,
            city: it.city,
            street: it.street,
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
            hostType: it.host_type,
            costs: it.costs,
            comments: it.comments
          })
      )
    )
    .build()
