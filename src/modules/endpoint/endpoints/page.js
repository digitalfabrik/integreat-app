import { filter, find, forEach } from 'lodash/collection'

import EndpointBuilder from '../EndpointBuilder'

import PageModel from '../models/PageModel'

export default new EndpointBuilder('pages')
  .withUrl('https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/pages?since=1970-01-01T00:00:00Z')
  .withStateMapper().fromArray(['location', 'language'], (state, paramName) => state.router.params[paramName])
  .withMapper((json, urlParams) => {
    const pages = json.filter((page) => page.status === 'publish')
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
          order: page.order,
          availableLanguages: page.available_languages
        })
      })

    // Set children
    forEach(pages, page => {
      const parent = find(pages, p => p.numericId === page.parent)
      if (parent) {
        parent.addChild(page)
      }
    })

    const children = filter(pages, (page) => page.parent === 0)
    return new PageModel({numericId: 0, id: 'rootId', title: urlParams.location, children})
  })
  .build()
