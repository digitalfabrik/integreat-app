import { DateTime } from 'luxon'

import NewsModel from '../../models/NewsModel.ts'

class NewsModelBuilder {
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

  build(): NewsModel[] {
    return this.buildAll().map(all => all.newsItem)
  }

  /**
   * Builds the requested amount of news. Two builds with an identical seed will yield equal news.
   */
  buildAll(): {
    path: string | null | undefined
    newsItem: NewsModel
  }[] {
    return Array.from(
      {
        length: this._newsCount,
      },
      () => ({
        path: null,
        newsItem: new NewsModel({
          id: 12,
          title: 'first news item',
          lastUpdate: DateTime.fromISO('2017-11-18T19:30:00.000Z'),
          content: 'This is a sample news',
          availableLanguages: {},
          source: 'local',
          externalUrl: 'https://example.com',
        }),
      }),
    )
  }
}

export default NewsModelBuilder
