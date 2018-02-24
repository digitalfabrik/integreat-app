import EndpointBuilder from '../EndpointBuilder'
import SprungbrettJobModel from '../models/SprungbrettJobModel'

export default new EndpointBuilder('sprungbrett')
  .withStateToUrlMapper((state) => `https://webnext.integreat-app.de/proxy/sprungbrett/app-search-internships?location=${state.sprungbrettUrl.url}`)
  .withMapper((json) => json.results
    .map((job, index) => new SprungbrettJobModel({
      id: index,
      title: job.title,
      city: job.city,
      url: job.url,
      isEmployment: job.employment === '1',
      isApprenticeship: job.apprenticeship === '1'
    }))
  )
  .build()
