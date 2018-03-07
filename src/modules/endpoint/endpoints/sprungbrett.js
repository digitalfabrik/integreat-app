import EndpointBuilder from '../EndpointBuilder'
import SprungbrettJobModel from '../models/SprungbrettJobModel'

export default new EndpointBuilder('sprungbrett')
  // currently not working since this is not the final url (will be changed with api v3)
  // todo remove this comment
  .withStateToUrlMapper(state => state.extras.data.find(extra => extra.alias === 'sprungbrett')._path)
  .withMapper(json => json.results
    .map((job, index) => new SprungbrettJobModel({
      id: index,
      title: job.title,
      location: `${job.zip} ${job.city}`,
      url: job.url,
      isEmployment: job.employment === '1',
      isApprenticeship: job.apprenticeship === '1'
    }))
  )
  .build()
