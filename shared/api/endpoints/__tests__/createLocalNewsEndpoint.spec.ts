import { DateTime } from 'luxon'

import { API_VERSION } from '../../constants'
import LocalNewsModel from '../../models/LocalNewsModel'
import { JsonLocalNewsType } from '../../types'
import createLocalNewsEndpoint from '../createLocalNewsEndpoint'

describe('localnews', () => {
  const baseUrl = 'https://cms.integreat-app.de'
  const localNews = createLocalNewsEndpoint(baseUrl)

  const createNewsItem = (date: string): JsonLocalNewsType => ({
    id: 217,
    title: 'Tick bite - What to do?',
    display_date: date,
    message:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.',
    available_languages: { de: { id: 123 }, it: { id: 234 } },
  })

  const item1 = createNewsItem('2020-03-20T17:50:00+02:00')
  const item2 = createNewsItem('2020-05-20T15:00:00+02:00')
  const item3 = createNewsItem('2019-07-20T00:00:00+02:00')

  const createNewsItemModel = (date: DateTime): LocalNewsModel =>
    new LocalNewsModel({
      id: 217,
      title: 'Tick bite - What to do?',
      timestamp: date,
      content:
        'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.',
      availableLanguages: { de: 123, it: 234 },
    })

  const itemModel1 = createNewsItemModel(DateTime.fromISO('2020-03-20T17:50:00+02:00'))
  const itemModel2 = createNewsItemModel(DateTime.fromISO('2020-05-20T15:00:00+02:00'))
  const itemModel3 = createNewsItemModel(DateTime.fromISO('2019-07-20T00:00:00+02:00'))
  const params = {
    city: 'testumgebung',
    language: 'en',
    count: 1,
  }

  it('should map params to url', () => {
    expect(localNews.mapParamsToUrl(params)).toBe(
      `https://cms.integreat-app.de/api/${API_VERSION}/${params.city}/${params.language}/fcm/?channel=news`,
    )
  })

  it('should map fetched data to models', () => {
    const json = [item1, item2, item3]
    const localNewsModels = localNews.mapResponse(json, params)
    const value = [itemModel1, itemModel2, itemModel3]
    expect(localNewsModels).toEqual(value)
  })
})
