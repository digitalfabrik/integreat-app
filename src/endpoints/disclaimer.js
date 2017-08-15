import Endpoint from './Endpoint'
import { reduce } from 'lodash'
import PageModel from './models/PageModel'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

export default new Endpoint(
  'disclaimer',
  'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/disclaimer?since={since}',
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
  },
  [],
  (state) => ({language: state.language.language}),
  (props) => ({
    location: props.location,
    language: props.language,
    since: BIRTH_OF_UNIVERSE
  }),
  (props) => ({location: props.location}),
  (props, nextProps) => props.language !== nextProps.language
)
