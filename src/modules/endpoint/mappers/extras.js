import ExtraModel from '../models/ExtraModel'

function extrasMapper (json) {
  return json
    .map(extra => new ExtraModel({
      alias: extra.alias,
      name: extra.name,
      path: extra.url,
      thumbnail: extra.thumbnail
    }))
}

export default extrasMapper
