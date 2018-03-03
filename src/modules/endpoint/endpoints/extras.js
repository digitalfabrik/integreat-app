import EndpointBuilder from '../EndpointBuilder'
import ExtraModel from '../models/ExtraModel'
import { apiUrl } from '../constants'

export default new EndpointBuilder('extras')
  .withStateToUrlMapper(state => `${apiUrl}/${state.router.params.location}` +
    `/${state.router.params.language}/wp-json/extensions/v3/extras/`)
  .withMapper(json => json
    .filter(extra => extra.enabled && extra.alias !== 'ige-c4r')
    .map(extra => new ExtraModel({
      type: extra.alias,
      name: extra.alias,
      path: extra.url
      // todo add thumnail and change name
    }))
  )
  .build()
