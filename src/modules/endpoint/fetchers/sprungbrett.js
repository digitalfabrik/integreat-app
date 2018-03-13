import SprungbrettJobModel from '../models/SprungbrettJobModel'

const urlMapper = params => params.url

const mapper = json =>
  json.results
    .map((job, index) => new SprungbrettJobModel({
      id: index,
      title: job.title,
      location: `${job.zip} ${job.city}`,
      url: job.url,
      isEmployment: job.employment === '1',
      isApprenticeship: job.apprenticeship === '1'
    }))

const fetcher = async params =>
  fetch(urlMapper(params))
    .then(json => mapper(json))

export default fetcher
