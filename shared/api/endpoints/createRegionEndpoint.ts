import { Endpoint, EndpointBuilder, RegionModel } from '..'

import { API_VERSION } from '../constants'
import mapRegionJson from '../mapping/mapRegionJson'

export const REGION_ENDPOINT_NAME = 'region'
type Params = {
  region: string
}

export default (baseUrl: string): Endpoint<Params, RegionModel> =>
  new EndpointBuilder<Params, RegionModel>(REGION_ENDPOINT_NAME)
    .withParamsToUrlMapper(({ region }: Params) => `${baseUrl}/api/${API_VERSION}/regions/${region}/`)
    .withMapper(mapRegionJson)
    .build()
