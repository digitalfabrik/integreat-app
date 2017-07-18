import Endpoint from './Endpoint'
import { reduce } from 'lodash'
import PageModel from './models/PageModel'

export default new Endpoint(
  'disclaimer',
  'http://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/disclaimer?since={since}',
  (json) => {
    return reduce(json, (result, page) => {
      if (page.status !== 'publish') {
        return
      }
      result[page.id] = new PageModel(
        page.id,
        page.title,
        page.parent,
        page.content,
        page.thumbnail
      )
    })
  }
)
