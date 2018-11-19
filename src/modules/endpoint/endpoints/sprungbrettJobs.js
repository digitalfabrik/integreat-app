// @flow

import SprungbrettJobModel from '../models/SprungbrettJobModel'
import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import Endpoint from '../Endpoint'
import type { JsonSprungbrettJobType } from '../types'

const SPRUNGBRETT_JOBS_ENDPOINT_NAME = 'sprungbrettJobs'

type ParamsType = { url: ?string }

const endpoint: Endpoint<ParamsType, Array<SprungbrettJobModel>> = new EndpointBuilder(SPRUNGBRETT_JOBS_ENDPOINT_NAME)
  .withParamsToUrlMapper((params): string => {
    if (!params.url) {
      throw new ParamMissingError(SPRUNGBRETT_JOBS_ENDPOINT_NAME, 'url')
    }
    return params.url
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
