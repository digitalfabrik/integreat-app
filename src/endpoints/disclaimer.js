import Endpoint from './Endpoint'
import { reduce } from 'lodash'
import PageModel from './models/PageModel'
import { isEmpty } from 'lodash/lang'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

export default new Endpoint({
  name: 'disclaimer',
  url: 'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/disclaimer?since={since}',
  jsonToAny: (json) => {
    if (!json || isEmpty(json)) {
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
  mapStateToUrlParams: (state) => ({
    language: state.router.params.language,
    location: state.router.params.location,
    since: BIRTH_OF_UNIVERSE
  }),
  shouldRefetch: (options, nextOptions) => options.language !== nextOptions.language
})
