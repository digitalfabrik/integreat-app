import { groupBy, sortBy } from 'lodash/collection'
import { isEmpty } from 'lodash/lang'

import { Endpoint } from './endpoint'
import { transform } from 'lodash/object'

export const LANGUAGE_ENDPOINT = new Endpoint(
  'languages',
  'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/languages/wpml',
  json => {
    return json
  }
)

export const EVENT_ENDPOINT = new Endpoint(
  'events',
  'http://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/events?since={since}',
  json => {
    return json
  }
)

export const PAGE_ENDPOINT = new Endpoint(
  'pages',
  'http://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/pages?since={since}',
  json => {
    json = transform(json, (result, page) => {
      if (page.status !== 'publish') {
        return
      }
      page = {
        id: page.id,
        name: page.name,
        parent: page.parent,
        content: page.content
      }
      result[page.id] = page
    }, {})
    return json
  }
)

export const LOCATION_ENDPOINT = new Endpoint(
  'locations',
  'https://cms.integreat-app.de/wp-json/extensions/v1/multisites',
  json => {
    let data = json.map((location) => ({name: location.name, path: location.path}))
    data = sortBy(data, ['name'])
    data = groupBy(data, location => isEmpty(location.name) ? '?' : location.name[0].toUpperCase())
    return data
  }
)

export const endpoints = [
  LANGUAGE_ENDPOINT,
  LOCATION_ENDPOINT,
  PAGE_ENDPOINT,
  EVENT_ENDPOINT
]
