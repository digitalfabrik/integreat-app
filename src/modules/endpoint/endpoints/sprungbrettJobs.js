// @flow

import SprungbrettJobModel from '../models/SprungbrettJobModel'
import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import type { EndpointParamsType, PayloadDataType } from 'flowTypes'

const SPRUNGBRETT_JOBS_ENDPOINT_NAME = 'sprungbrettJobs'

export default new EndpointBuilder(SPRUNGBRETT_JOBS_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: EndpointParamsType): string => {
    if (!params.url) {
      throw new ParamMissingError(SPRUNGBRETT_JOBS_ENDPOINT_NAME, 'url')
    }
    return params.url
  })
  .withMapper((json: any): PayloadDataType => json.results
    .map((job, index) => new SprungbrettJobModel({
      id: index,
      title: job.title,
      location: `${job.zip} ${job.city}`,
      url: job.url,
      isEmployment: job.employment === '1',
      isApprenticeship: job.apprenticeship === '1'
    })))
  .build()
