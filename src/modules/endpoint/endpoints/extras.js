import EndpointBuilder from '../EndpointBuilder'
import ExtraModel from '../models/ExtraModel'

export default new EndpointBuilder('extras')
  .withUrl('https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v3/extras/')
  .withStateMapper().fromArray(['location', 'language'], (state, paramName) => state.router.params[paramName])
  .withMapper((json) => json
    .filter(extra => extra.enabled)
    .map(extra => new ExtraModel({
      type: extra.alias,
      name: extra.alias,
      url: extra.url
    }))
  )
  .build()
