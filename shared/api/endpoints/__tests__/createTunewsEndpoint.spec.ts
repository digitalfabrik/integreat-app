import { DateTime } from 'luxon'

import TunewsModel from '../../models/TunewsModel'
import { JsonTunewsType } from '../../types'
import createTunewsEndpoint from '../createTunewsEndpoint'

describe('tunews', () => {
  const baseUrl = 'https://tunews.integreat-app.de'
  const tunews = createTunewsEndpoint(baseUrl)

  const createNewsItem = (id: number, displayDate: string): JsonTunewsType => ({
    id,
    title: 'Tick bite - What to do?',
    tags: ['8 Gesundheit'],
    display_date: displayDate,
    content:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
    enewsno: 'tun0000009902',
  })

  const item1 = createNewsItem(1, '2020-01-20T12:04:22+00:00')
  const item2 = createNewsItem(2, '2020-01-24T10:05:22+00:00')
  const item3 = createNewsItem(3, '2020-01-22T11:06:22+00:00')

  const createNewsItemModel = (id: number, lastUpdate: DateTime): TunewsModel =>
    new TunewsModel({
      id,
      title: 'Tick bite - What to do?',
      tags: ['8 Gesundheit'],
      lastUpdate,
      content:
        'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
      eNewsNo: 'tun0000009902',
    })

  const itemModel1 = createNewsItemModel(1, DateTime.fromISO('2020-01-20T12:04:22+00:00'))
  const itemModel2 = createNewsItemModel(2, DateTime.fromISO('2020-01-24T10:05:22+00:00'))
  const itemModel3 = createNewsItemModel(3, DateTime.fromISO('2020-01-22T11:06:22+00:00'))
  const params = {
    language: 'de',
    page: 1,
    count: 1,
  }
  it('should map params to url', () => {
    expect(tunews.mapParamsToUrl(params)).toBe(
      `${baseUrl}/v1/news/${params.language}?page=${params.page}&count=${params.count}`,
    )
  })
  const json = [item1, item2, item3]
  it('should map fetched data to models', () => {
    const tunewsModels = tunews.mapResponse(json, params)
    const newsItemsValues = [itemModel1, itemModel2, itemModel3]
    expect(tunewsModels).toEqual(newsItemsValues)
  })
})
