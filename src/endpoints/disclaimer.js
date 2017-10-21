import Endpoint from './Endpoint'
import { reduce } from 'lodash'
import PageModel from './models/PageModel'
import { isEmpty } from 'lodash/lang'

export default new Endpoint({
  name: 'disclaimer',
  url: 'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/disclaimer?since=1970-01-01T00:00:00Z',
  jsonToAny: (json) => {
    if (isEmpty(json)) {
      throw new Error('disclaimer.notAvailable')
    }

    return reduce(json, (result, page) => {
      if (page.status !== 'publish') {
        return result
      }

      const id = page.permalink.url_page.split('/').pop()
      const numericId = page.id

      return new PageModel({
        id,
        numericId,
        title: page.title,
        parent: page.parent,
        content: page.content,
        thumbnail: page.thumbnail,
        order: page.order
      })
    }, null)
  },
  mapStateToOptions: (state) => ({
    language: state.router.params.language,
    location: state.router.params.location
  }),
  shouldRefetch: (options, nextOptions) => options.language !== nextOptions.language
})
