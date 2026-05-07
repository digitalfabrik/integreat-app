import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import mapRegionJson from '../mapping/mapRegionJson'
import RegionModel from '../models/RegionModel'
import { JsonRegionType } from '../types'

export const REGIONS_ENDPOINT_NAME = 'regions'

export default (baseUrl: string): Endpoint<Record<string, unknown> | void, RegionModel[]> =>
  new EndpointBuilder<Record<string, unknown> | void, RegionModel[]>(REGIONS_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => `${baseUrl}/api/${API_VERSION}/regions/`)
    .withMapper((json: JsonRegionType[]) =>
      json.map(mapRegionJson).sort((region1, region2) => region1.sortingName.localeCompare(region2.sortingName)),
    )
    .build()
