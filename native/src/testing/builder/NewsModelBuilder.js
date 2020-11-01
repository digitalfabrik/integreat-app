// @flow

import { LocalNewsModel } from 'api-client'
import moment from 'moment'

class LocalNewsModelBuilder {
  _newsCount: number
  _seed: string
  _city: string
  _language: string

  constructor (seed: string, newsCount: number, city: string, language: string) {
    this._seed = seed
    this._newsCount = newsCount
    this._city = city
    this._language = language
  }

  build (): Array<LocalNewsModel> {
    return this.buildAll().map(all => all.newsItem)
  }

  /**
   * Builds the requested amount of news. Two builds with an identical seed will yield equal news.
   */
  buildAll (): Array<{ path: ?string, newsItem: LocalNewsModel }> {
    return Array.from({ length: this._newsCount }, (x, index) => {
      return {
        path: null,
        newsItem: new LocalNewsModel({
          id: 12,
          title: 'first news item',
          timestamp: moment('2017-11-18T19:30:00.000Z'),
          message: 'This is a sample news'
        })
      }
    })
  }
}

export default LocalNewsModelBuilder
