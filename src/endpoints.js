import { groupBy, sortBy } from 'lodash/collection'
import { isEmpty } from 'lodash/lang'

import { Endpoint } from './endpoint'

export const LANGUAGE_ENDPOINT = new Endpoint(
  'languages',
  'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/languages/wpml',
  json => {
    return json
  }
)

export const EVENT_ENDPOINT = new Endpoint(
  'languages',
  'http://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/events?since={since}',
  json => {
    return json
  }
)

export const PAGE_ENDPOINT = new Endpoint(
  'languages',
  'http://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/pages?since={since}',
  json => {
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
  LOCATION_ENDPOINT
]
