import SprungbrettJobModel from '../models/SprungbrettJobModel'

function sprungbrettMapper (json) {
  return json.results
    .map((job, index) => new SprungbrettJobModel({
      id: index,
      title: job.title,
      location: `${job.zip} ${job.city}`,
      url: job.url,
      isEmployment: job.employment === '1',
      isApprenticeship: job.apprenticeship === '1'
    }))
}

export default sprungbrettMapper
