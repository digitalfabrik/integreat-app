import { DateTime } from 'luxon'

import NewsModel from '../../models/NewsModel.ts'
import { JsonNewsType } from '../../types.ts'
import mapNewsJson from '../mapNewsJson.ts'

describe('mapNewsJson', () => {
  const buildJson = (overrides: Partial<JsonNewsType> = {}): JsonNewsType => ({
    id: 1,
    title: 'News title',
    content: '<p>News body</p>',
    display_date: '2020-03-20T17:50:00+02:00',
    source: 'local',
    externalUrl: 'https://example.com',
    available_languages: { de: { id: 1 }, en: { id: 42 } },
    ...overrides,
  })

  it('should map fields from JSON to NewsModel', () => {
    const news = mapNewsJson(buildJson())
    expect(news).toEqual(
      new NewsModel({
        id: 1,
        title: 'News title',
        content: '<p>News body</p>',
        source: 'local',
        lastUpdate: DateTime.fromISO('2020-03-20T17:50:00+02:00'),
        availableLanguages: { de: 1, en: 42 },
        externalUrl: 'https://example.com',
      }),
    )
  })

  it('should strip manual height attributes from image tags', () => {
    const news = mapNewsJson(
      buildJson({
        content: '<img src="a.png" height="200" width="200"/><img src="b.png" height="42"/>',
      }),
    )
    expect(news.content).toBe('<img src="a.png" width="200"/><img src="b.png"/>')
  })

  it('should keep style-based heights untouched', () => {
    const news = mapNewsJson(buildJson({ content: '<img src="a.png" style="height:200px"/>' }))
    expect(news.content).toBe('<img src="a.png" style="height:200px"/>')
  })

  it('should map null available_languages to null', () => {
    const news = mapNewsJson(buildJson({ available_languages: null }))
    expect(news.availableLanguages).toBeNull()
  })

  it('should map empty available_languages to an empty object', () => {
    const news = mapNewsJson(buildJson({ available_languages: {} }))
    expect(news.availableLanguages).toEqual({})
  })
})
