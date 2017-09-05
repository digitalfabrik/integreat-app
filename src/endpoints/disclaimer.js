import Endpoint from './Endpoint'
import { reduce } from 'lodash'
import PropTypes from 'prop-types'
import PageModel from './models/PageModel'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

export default new Endpoint({
  name: 'disclaimer',
  url: 'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/disclaimer?since={since}',
  optionsPropType: PropTypes.shape({}),
  jsonToAny: (json) => {
    if (!json) {
      return {}
    }
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
  },
  mapStateToOptions: (state) => ({language: state.language.language}),
  mapOptionsToUrlParams: (options) => ({
    location: options.location,
    language: options.language,
    since: BIRTH_OF_UNIVERSE
  }),
  shouldRefetch: (options, nextOptions) => options.language !== nextOptions.language
})
