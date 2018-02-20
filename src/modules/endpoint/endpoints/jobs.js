import EndpointBuilder from '../EndpointBuilder'
import JobModel from '../models/JobModel'

export default new EndpointBuilder('jobs')
  .withUrl('{url}')
  .withStateMapper().fromFunction(state => ({url: state.sprungbrettUrl.url}))
  .withMapper((json) => json.results
    .map(job => new JobModel({
      title: job.title,
      city: job.city,
      url: job.url,
      isEmployment: job.employment === 1,
      isApprenticeship: job.apprenticeship === 1
    }))
  )
  .build()
