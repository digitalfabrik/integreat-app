import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import SprungbrettJobModel from '../models/SprungbrettJobModel'
import { JsonSprungbrettJobType } from '../types'

export const SPRUNGBRETT_JOBS_ENDPOINT_NAME = 'sprungbrettJobs'

export default (baseUrl: string): Endpoint<void, SprungbrettJobModel[]> =>
  new EndpointBuilder<void, SprungbrettJobModel[]>(SPRUNGBRETT_JOBS_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => baseUrl)
    .withMapper((json: { results: JsonSprungbrettJobType[] }): SprungbrettJobModel[] =>
      json.results.map(
        (job, index) =>
          new SprungbrettJobModel({
            id: index,
            title: job.title,
            location: `${job.zip} ${job.city}`,
            url: job.url,
            isEmployment: job.employment === '1',
            isApprenticeship: job.apprenticeship === '1',
          }),
      ),
    )
    .build()
