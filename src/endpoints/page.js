import { transform } from 'lodash/object'
import { forEach } from 'lodash/collection'
import PropTypes from 'prop-types'
import Endpoint from './Endpoint'
import PageModel, { EMPTY_PAGE } from './models/PageModel'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

export default new Endpoint({
  name: 'pages',
  url: 'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/pages?since={since}',
  optionsPropType: PropTypes.shape({}),
  jsonToAny: (json, options) => {
    if (!json) {
      return EMPTY_PAGE
    }
    let pages = transform(json, (result, page) => {
      if (page.status !== 'publish') {
        return
      }

      const id = page.permalink.url_page.split('/').pop()
      const numericId = page.id

      result[numericId] = new PageModel(
        id,
        numericId,
        page.title,
        page.parent,
        page.content,
        page.thumbnail
      )
    }, {})

    // Set children
    forEach(pages, page => {
      const parent = pages[page.parent]
      if (!parent) {
        return
      }
      parent.addChild(page)
    })

    // Filter parents
    const children = transform(pages, (result, page) => {
      if (page.parent === 0) {
        result[page.id] = page
      }
    }, {})
    return new PageModel(0, 'rootId', options.location, 0, '', null, children)
  },
  mapStateToOptions: (state) => ({language: state.router.params.language, location: state.router.params.location}),
  mapOptionsToUrlParams: (options) => ({
    location: options.location,
    language: options.language,
    since: BIRTH_OF_UNIVERSE
  }),
  shouldRefetch: (options, nextOptions) => {
    return (options.language !== nextOptions.language)
  }
})
