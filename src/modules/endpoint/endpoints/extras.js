import EndpointBuilder from '../EndpointBuilder'
import ExtraModel from '../models/ExtraModel'
import { apiUrl } from '../constants'

export default new EndpointBuilder('extras')
  .withStateToUrlMapper(state => `${apiUrl}/${state.router.params.location}` +
    `/${state.router.params.language}/wp-json/extensions/v3/extras`)
  .withMapper(json => json
    .map(extra => new ExtraModel({
      alias: extra.alias,
      name: extra.name,
      path: extra.url,
      thumbnail: extra.thumbnail
    }))
  )
  .build()
