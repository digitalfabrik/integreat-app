import { DateTime } from 'luxon'

import { MAX_DAYS_NEW } from '../../../constants/index.ts'
import NewsModel from '../NewsModel.ts'

describe('NewsModel', () => {
  const createNews = (publishedAt: DateTime) =>
    new NewsModel({
      id: 'local-1',
      title: 'News',
      content: 'Content',
      lastUpdate: publishedAt,
      publishedAt,
      source: 'local',
      availableLanguages: null,
      externalUrl: 'https://example.com',
    })

  describe('isNew', () => {
    it('should be new if published less than MAX_DAYS_NEW days ago', () => {
      expect(createNews(DateTime.now().minus({ days: MAX_DAYS_NEW - 1 })).isNew).toBe(true)
    })

    it('should not be new if published MAX_DAYS_NEW or more days ago', () => {
      expect(createNews(DateTime.now().minus({ days: MAX_DAYS_NEW })).isNew).toBe(false)
      expect(createNews(DateTime.now().minus({ days: MAX_DAYS_NEW + 1 })).isNew).toBe(false)
    })

    it('should not be new if the publishing date is invalid', () => {
      expect(createNews(DateTime.fromISO('')).isNew).toBe(false)
    })
  })
})
