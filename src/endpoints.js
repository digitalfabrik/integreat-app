import { forEach, groupBy, sortBy } from 'lodash/collection'
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
  'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/events?since={since}',
  json => {
    return json
  }
)

class Page {
  constructor (id, title, parent, content, thumbnail) {
    this._id = id
    this._title = title
    this._content = content
    this._children = []
    this._parent = parent
    this._thumbnail = thumbnail
  }

  get thumbnail () {
    return this._thumbnail
  }

  addChild (page) {
    this._children.push(page)
  }

  get id () {
    return this._id
  }

  get title () {
    return this._title
  }

  get content () {
    return this._content
  }

  get parent () {
    return this._parent
  }

  get children () {
    return this._children
  }
}

export const PAGE_ENDPOINT = new Endpoint(
  'pages',
  'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/pages?since={since}',
  json => {
    let pages = transform(json, (result, page) => {
      if (page.status !== 'publish') {
        return
      }
      result[page.id] = new Page(
        page.id,
        page.title,
        page.parent,
        page.content,
        page.thumbnail
      )
    }, {})

    forEach(pages, page => {
      let parent = pages[page.parent]
      if (!parent) {
        return
      }
      parent.addChild(page)
    })

    return transform(pages, (result, page) => {
      if (page.parent === 0) {
        result.push(page)
      }
    }, [])
  }
)

class Location {
  constructor (name, path) {
    this._name = name
    this._path = path
  }

  get name () {
    return this._name
  }

  get path () {
    return this._path
  }

  get category () {
    return isEmpty(this._name) ? '?' : this._name[0].toUpperCase();
  }
}

export const LOCATION_ENDPOINT = new Endpoint(
  'locations',
  'https://cms.integreat-app.de/wp-json/extensions/v1/multisites',
  json => {
    let locations = json.map((location) => new Location(location.name, location.path))
    locations = sortBy(locations, location => location.name)
    let groups = groupBy(locations, location => location.category)
    return groups
  }
)

export const endpoints = [
  LANGUAGE_ENDPOINT,
  LOCATION_ENDPOINT,
  PAGE_ENDPOINT,
  EVENT_ENDPOINT
]
