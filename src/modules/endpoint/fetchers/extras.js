import { apiUrl } from '../constants'
import ExtraModel from '../models/ExtraModel'

const urlMapper = params => `${apiUrl}/${params.location}/${params.language}/wp-json/extensions/v3/extras`

const mapper = json =>
  json
    .map(extra => new ExtraModel({
      alias: extra.alias,
      name: extra.name,
      path: extra.url,
      thumbnail: extra.thumbnail
    }))

const fetcher = async params =>
  fetch(urlMapper(params))
    .then(json => mapper(json))

export default fetcher
