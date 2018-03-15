// @flow

import SprungbrettJobModel from '../models/SprungbrettJobModel'
import type { Dispatch } from 'redux-first-router/dist/flow-types'
import { saveSprungbrettJobs } from '../actions/fetcher'

type Params = {
  url: string
}

const urlMapper = (params: Params): string => params.url

const mapper = (json: any): Array<SprungbrettJobModel> =>
  json.results
    .map((job, index) => new SprungbrettJobModel({
      id: index,
      title: job.title,
      location: `${job.zip} ${job.city}`,
      url: job.url,
      isEmployment: job.employment === '1',
      isApprenticeship: job.apprenticeship === '1'
    }))

const fetcher = (dispatch: Dispatch, params: Params): Promise<Array<SprungbrettJobModel>> =>
  fetch(urlMapper(params))
    .then(response => response.json())
    .then(json => mapper(json))
    .then(jobs => {
      dispatch(saveSprungbrettJobs(jobs))
      return jobs
    })

export default fetcher
