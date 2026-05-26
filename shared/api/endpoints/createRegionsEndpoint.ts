import Endpoint from '../Endpoint.js'
import EndpointBuilder from '../EndpointBuilder.js'
import { API_VERSION } from '../constants/index.js'
import mapRegionJson from '../mapping/mapRegionJson.js'
import RegionModel from '../models/RegionModel.js'
import { JsonRegionType } from '../types.js'

export const REGIONS_ENDPOINT_NAME = 'regions'

export default (baseUrl: string): Endpoint<Record<string, unknown> | void, RegionModel[]> =>
  new EndpointBuilder<Record<string, unknown> | void, RegionModel[]>(REGIONS_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => `${baseUrl}/api/${API_VERSION}/regions/`)
    .withMapper((json: JsonRegionType[]) =>
      json.map(mapRegionJson).sort((region1, region2) => region1.sortingName.localeCompare(region2.sortingName)),
    )
    .build()
