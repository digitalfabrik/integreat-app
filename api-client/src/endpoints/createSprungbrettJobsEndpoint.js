// @flow

import SprungbrettJobModel from '../models/SprungbrettJobModel'
import EndpointBuilder from '../EndpointBuilder'
import Endpoint from '../Endpoint'
import type { JsonSprungbrettJobType } from '../types'

export const SPRUNGBRETT_JOBS_ENDPOINT_NAME = 'sprungbrettJobs'

export const SPRUNGBRETT_OFFER = 'sprungbrett'

export default (baseUrl: string): Endpoint<*, Array<SprungbrettJobModel>> =>
  new EndpointBuilder(SPRUNGBRETT_JOBS_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => {
      return baseUrl
    })
    .withMapper((json: { results: Array<JsonSprungbrettJobType> }): Array<SprungbrettJobModel> => json.results
      .map((job, index) => new SprungbrettJobModel({
        id: index,
        title: job.title,
        location: `${job.zip} ${job.city}`,
        url: job.url,
        isEmployment: job.employment === '1',
        isApprenticeship: job.apprenticeship === '1'
      })))
    .build()
