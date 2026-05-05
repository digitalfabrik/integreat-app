import { DateTime } from 'luxon'

import LocalNewsModel from '../../models/LocalNewsModel'

class LocalNewsModelBuilder {
  _newsCount: number
  _seed: string
  _region: string
  _language: string

  constructor(seed: string, newsCount: number, region: string, language: string) {
    this._seed = seed
    this._newsCount = newsCount
    this._region = region
    this._language = language
  }

  build(): LocalNewsModel[] {
    return this.buildAll().map(all => all.newsItem)
  }

  /**
   * Builds the requested amount of news. Two builds with an identical seed will yield equal news.
   */
  buildAll(): {
    path: string | null | undefined
    newsItem: LocalNewsModel
  }[] {
    return Array.from(
      {
        length: this._newsCount,
      },
      () => ({
        path: null,
        newsItem: new LocalNewsModel({
          id: 12,
          title: 'first news item',
          timestamp: DateTime.fromISO('2017-11-18T19:30:00.000Z'),
          content: 'This is a sample news',
          availableLanguages: {},
        }),
      }),
    )
  }
}

export default LocalNewsModelBuilder
