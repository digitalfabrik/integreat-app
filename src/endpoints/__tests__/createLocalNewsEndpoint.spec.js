// @flow

import moment from 'moment-timezone'
import createLocalNewsEndpoint from '../createLocalNewsEndpoint'
import LocalNewsModel from '../../models/LocalNewsModel'
import type { JsonLocalNewsType } from '../../types'
import type Moment from 'moment'

describe('localnews', () => {
  const baseUrl = 'https://cms.integreat-app.de'
  const localNews = createLocalNewsEndpoint(baseUrl)

  const createNewsItem = (date): JsonLocalNewsType => ({
    id: 217,
    title: 'Tick bite - What to do?',
    timestamp: date,
    message:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
  })

  const item1 = createNewsItem('2020-03-20 17:50:00')
  const item2 = createNewsItem('2020-05-20 15:00:00')
  const item3 = createNewsItem('2019-07-20 00:00:00')

  const createNewsItemModel = (date: Moment): LocalNewsModel =>
    new LocalNewsModel({
      id: 217,
      title: 'Tick bite - What to do?',
      timestamp: date,
      message:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
    })

  const itemModel1 = createNewsItemModel(
    moment.tz('2020-03-20 17:50:00', 'GMT')
  )
  const itemModel2 = createNewsItemModel(
    moment.tz('2020-05-20 15:00:00', 'GMT')
  )
  const itemModel3 = createNewsItemModel(
    moment.tz('2019-07-20 00:00:00', 'GMT')
  )

  const params = { city: 'testumgebung', language: 'en', count: 1 }

  it('should map params to url', () => {
    expect(localNews.mapParamsToUrl(params)).toEqual(
      `https://cms.integreat-app.de/${params.city}/${params.language}/wp-json/extensions/v3/fcm?channel=news`
    )
  })

  const json = [item1, item2, item3]

  it('should map fetched data to models', () => {
    const localNewsModels = localNews.mapResponse(json, params)

    const value = [itemModel1, itemModel2, itemModel3]
    expect(localNewsModels).toEqual(value)
  })
})
