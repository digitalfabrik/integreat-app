// @flow

import SprungbrettJobModel from '../models/SprungbrettJobModel'
import type { Dispatch } from 'redux-first-router/dist/flow-types'
import EndpointBuilder from '../EndpointBuilder'
import Payload from '../Payload'

type Params = {
  url: string
}

export default (dispatch: Dispatch, oldPayload: Payload, params: Params): Promise<Payload> => new EndpointBuilder('sprungbrettJobs')
  .withParamsToUrlMapper((params: Params): string => params.url)
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
  .fetchData(dispatch, oldPayload, params)
