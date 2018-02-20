import EndpointBuilder from '../EndpointBuilder'
import JobModel from '../models/JobModel'

export default new EndpointBuilder('jobs')
  .withUrl('{url}')
  .withStateMapper().fromArray(['url'], (state, paramName) => state[paramName])
  .withMapper((json) => json
    .filter(event => event.status === 'publish')
    .map(job => new JobModel({
      title: job.title,
      city: job.city,
      url: job.url,
      isEmployment: job.employment === 1,
      isApprenticeship: job.apprenticeship === 1
    }))
  )
  .build()
