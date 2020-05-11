// @flow

import { LocationModel, PoiModel } from '@integreat-app/integreat-api-client'

const map = {}
map.ID1 = 'Farm1'
map.ID2 = 'Farm2'

const pois = [
  new PoiModel({
    path: 'test',
    title: 'test',
    content: 'test',
    thumbnail: 'test',
    availableLanguages: map,
    excerpt: 'test',
    location: LocationModel,
    lastUpdate: require('moment'),
    hash: 'test'
  }),
  new PoiModel({
    path: 'test',
    title: 'test',
    content: 'test',
    thumbnail: 'test',
    availableLanguages: map,
    excerpt: 'test',
    location: LocationModel,
    lastUpdate: require('moment'),
    hash: 'test'
  })
]

class PoiModelBuilder {
  _poisCount: number

  constructor (poisCount: number) {
    if (this._poisCount > pois.length) {
      throw new Error(`Only ${pois.length} poi models can be created`)
    }
    this._poisCount = poisCount
  }

  build (): Array<PoiModel> {
    return pois.slice(0, this._poisCount)
  }
}

export default PoiModelBuilder
