import { transform } from 'lodash/object'
import { forEach } from 'lodash/collection'
import PropTypes from 'prop-types'
import Endpoint from './Endpoint'
import PageModel, { EMPTY_PAGE } from './models/PageModel'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

export default new Endpoint({
  name: 'pages',
  url: 'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/pages?since={since}',
  optionsPropType: PropTypes.shape({
    location: PropTypes.string.isRequired,
    language: PropTypes.string
  }),
  jsonToAny: (json, options) => {
    if (!json) {
      return EMPTY_PAGE
    }
    let pages = transform(json, (result, page) => {
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
    }, {})

    // Set children
    forEach(pages, page => {
      let parent = pages[page.parent]
      if (!parent) {
        return
      }
      parent.addChild(page)
    })

    // Filter parents
    let children = transform(pages, (result, page) => {
      if (page.parent === 0) {
        result[page.id] = page
      }
    }, {})
    return new PageModel(0, options.location, 0, '', null, children)
  },
  mapStateToOptions: (state) => ({language: state.language.language}),
  mapOptionsToUrlParams: (options) => ({
    location: options.location,
    language: options.language,
    since: BIRTH_OF_UNIVERSE
  }),
  shouldRefetch: (options, nextOptions) => (options.language !== nextOptions.language)
})
