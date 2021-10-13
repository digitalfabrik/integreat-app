import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import SprungbrettJobModel from '../models/SprungbrettJobModel'
import { JsonSprungbrettJobType } from '../types'

export const SPRUNGBRETT_JOBS_ENDPOINT_NAME = 'sprungbrettJobs'
export const SPRUNGBRETT_OFFER = 'sprungbrett'
export default (baseUrl: string): Endpoint<void, Array<SprungbrettJobModel>> =>
  new EndpointBuilder<void, Array<SprungbrettJobModel>>(SPRUNGBRETT_JOBS_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => baseUrl)
    .withMapper(
      (json: { results: Array<JsonSprungbrettJobType> }): Array<SprungbrettJobModel> =>
        json.results.map(
          (job, index) =>
            new SprungbrettJobModel({
              id: index,
              title: job.title,
              location: `${job.zip} ${job.city}`,
              url: job.url,
              isEmployment: job.employment === '1',
              isApprenticeship: job.apprenticeship === '1'
            })
        )
    )
    .build()
