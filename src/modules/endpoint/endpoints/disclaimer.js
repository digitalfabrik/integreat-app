import { isEmpty } from 'lodash/lang'

import EndpointBuilder from '../EndpointBuilder'

import PageModel from '../models/CategoryModel'

export default new EndpointBuilder('disclaimer')
  .withUrl('https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/disclaimer?since=1970-01-01T00:00:00Z')
  .withStateMapper().fromArray(['location', 'language'], (state, paramName) => state.router.params[paramName])
  .withMapper((json) => {
    if (isEmpty(json)) {
      throw new Error('disclaimer:notAvailable')
    }

    const disclaimers = json
      .filter((page) => page.status === 'publish')
      .map((page) => {
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
      })

    if (disclaimers.length !== 1) {
      throw new Error('There must be exactly one disclaimer!')
    }

    return disclaimers[0]
  })
  .build()
