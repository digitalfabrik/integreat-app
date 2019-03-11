// @flow

import SprungbrettJobModel from '../models/SprungbrettJobModel'
import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import Endpoint from '../Endpoint'
import type { JsonSprungbrettJobType } from '../types'

const SPRUNGBRETT_JOBS_ENDPOINT_NAME = 'sprungbrettJobs'

const endpoint: Endpoint<*, Array<SprungbrettJobModel>> = new EndpointBuilder(SPRUNGBRETT_JOBS_ENDPOINT_NAME)
  .withParamsToUrlMapper((apiUrl: string): string => {
    if (!apiUrl) {
      throw new ParamMissingError(SPRUNGBRETT_JOBS_ENDPOINT_NAME, 'apiUrl')
    }
    return apiUrl
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

export default endpoint
