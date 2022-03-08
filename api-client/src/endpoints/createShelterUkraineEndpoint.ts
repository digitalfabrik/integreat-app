import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import ShelterUkraineModel from '../models/ShelterUkraineModel'
import { JsonShelterUkraineJsonType } from '../types'

const SHELTER_UKRAINE_URL = 'https://cms-test.integreat-app.de/wp-json/extensions/v3/sites'

export const SHELTER_UKRAINE_ENDPOINT_NAME = 'shelter-ukraine'

export default (): Endpoint<void, ShelterUkraineModel[]> =>
  new EndpointBuilder<void, ShelterUkraineModel[]>(SHELTER_UKRAINE_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => SHELTER_UKRAINE_URL)
    .withMapper((json: { results: JsonShelterUkraineJsonType }): ShelterUkraineModel[] => [
      new ShelterUkraineModel({ id: 0, title: 'Unterkunft 0' }),
      new ShelterUkraineModel({ id: 1, title: 'Unterkunft 1' })
    ])
    .build()
