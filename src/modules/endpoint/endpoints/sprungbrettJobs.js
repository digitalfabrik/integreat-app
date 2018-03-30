// @flow

import SprungbrettJobModel from '../models/SprungbrettJobModel'
import EndpointBuilder from '../EndpointBuilder'
import type { Params } from '../Endpoint'

export default new EndpointBuilder('sprungbrettJobs')
  .withParamsToUrlMapper((params: Params): string => {
    if (!params.url) {
      throw new Error('The url is missing. Could not map the params to the sprungbrettJobs endpoint url.')
    }
    return params.url
  })
  .withMapper((json: any): Array<SprungbrettJobModel> => json.results
    .map((job, index) => new SprungbrettJobModel({
      id: index,
      title: job.title,
      location: `${job.zip} ${job.city}`,
      url: job.url,
      isEmployment: job.employment === '1',
      isApprenticeship: job.apprenticeship === '1'
    })))
  .build()
