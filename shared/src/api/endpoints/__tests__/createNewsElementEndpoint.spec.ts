import { DateTime } from 'luxon'

import { API_VERSION } from '../../constants/index.ts'
import NewsModel from '../../models/NewsModel.ts'
import { JsonNewsType } from '../../types.ts'
import createNewsElementEndpoint from '../createNewsElementEndpoint.ts'

describe('createNewsElementEndpoint', () => {
  const baseUrl = 'https://cms.integreat-app.de'
  const localNewsElement = createNewsElementEndpoint(baseUrl)

  const createNewsItem = (date: string): JsonNewsType => ({
    id: 1,
    title: 'Tick bite - What to do?',
    display_date: date,
    content:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.',
    available_languages: { de: { id: 1234 } },
    source: 'local',
    externalUrl: 'https://example.com',
  })

  const item = createNewsItem('2020-03-20T17:50:00+02:00')

  const createNewsItemModel = (date: DateTime): NewsModel =>
    new NewsModel({
      id: 1,
      title: 'Tick bite - What to do?',
      lastUpdate: date,
      content:
        'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.',
      availableLanguages: { de: 1234 },
      externalUrl: 'https://example.com',
      source: 'local',
    })

  const itemValue = createNewsItemModel(DateTime.fromISO('2020-03-20T17:50:00+02:00'))
  const params = {
    region: 'testumgebung',
    language: 'en',
    id: '1',
  }

  it('should map params to url', () => {
    expect(localNewsElement.mapParamsToUrl(params)).toBe(
      `${baseUrl}/api/${API_VERSION}/${params.region}/${params.language}/news/${params.id}`,
    )
  })

  it('should map fetched data to models', () => {
    const itemModel = localNewsElement.mapResponse(item, params)
    expect(itemModel).toEqual(itemValue)
  })
})
