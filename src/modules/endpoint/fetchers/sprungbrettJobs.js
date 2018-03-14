// @flow

import SprungbrettJobModel from '../models/SprungbrettJobModel'

type Params = {
  url: string
}

type Dispatch = ({type: string, payload: Array<SprungbrettJobModel>}) => {}

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

const fetcher = (params: Params, dispatch: Dispatch): Promise<Array<SprungbrettJobModel>> =>
  fetch(urlMapper(params))
    .then(response => response.json())
    .then(json => mapper(json))
    .then(jobs => {
      dispatch({type: 'SPRUNGBRETT_JOBS_FETCHED', payload: jobs})
      return jobs
    })

export default fetcher
