import { forEach, find, filter } from 'lodash/collection'
import Endpoint from './Endpoint'
import PageModel, { EMPTY_PAGE } from './models/PageModel'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

export default new Endpoint({
  name: 'pages',
  url: 'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/pages?since={since}',
  beforeFetch: () => fetch('https://cms.integreat-app.de/wp-json/extensions/v1/multisites')
    .then(response => response.json())
    .then(locations => ({ locations })),
  jsonToAny: (json, options) => {
    if (!json) {
      return EMPTY_PAGE
    }
    let pages = json.filter((page) => page.status === 'publish')
      .map((page) => {
        const id = decodeURIComponent(page.permalink.url_page).split('/').pop()
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
      })

    // Set children
    forEach(pages, page => {
      const parent = find(pages, p => p.numericId === page.parent)
      if (parent) {
        parent.addChild(page)
      }
    })

    // Get Location Title
    const stripSlashes = (path) => {
      if (path.startsWith('/')) {
        path = path.substr(1)
      }
      if (path.endsWith('/')) {
        path = path.substr(0, path.length - 1)
      }
      return path
    }

    const title = find(options.locations, (loc) => stripSlashes(loc.path) === options.location).name || options.location

    const children = filter(pages, (page) => page.parent === 0)
    return new PageModel({ numericId: 0, id: 'rootId', title, children })
  },
  mapStateToOptions: (state) => ({language: state.router.params.language, location: state.router.params.location}),
  mapOptionsToUrlParams: (options) => ({
    location: options.location,
    language: options.language,
    since: BIRTH_OF_UNIVERSE
  }),
  shouldRefetch: (options, nextOptions) => options.language !== nextOptions.language
})
