import EndpointBuilder from '../EndpointBuilder'
import ExtraModel from '../models/ExtraModel'

export default new EndpointBuilder('extras')
  .withStateToUrlMapper((state) => `https://cms.integreat-app.de/${state.router.params.location}` +
    `/${state.router.params.language}/wp-json/extensions/v3/extras/`)
  .withMapper((json) => json
    .filter(extra => extra.enabled && extra.alias !== 'ige-c4r')
    .map(extra => new ExtraModel({
      type: extra.alias,
      name: extra.alias,
      url: extra.url
    }))
  )
  .build()
