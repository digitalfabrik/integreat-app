// @flow

import moment from 'moment-timezone'
import createLocalNewsElementEndpoint from '../createLocalNewsElementEndpoint'
import LocalNewsModel from '../../models/LocalNewsModel'
import type { JsonLocalNewsType } from '../../types'
import type Moment from 'moment'

describe('localnews', () => {
  const baseUrl = 'https://cms.integreat-app.de'
  const localNewsElement = createLocalNewsElementEndpoint(baseUrl)

  const createNewsItem = (date): JsonLocalNewsType => ({
    id: 1,
    title: 'Tick bite - What to do?',
    timestamp: date,
    message:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
  })

  const item = createNewsItem('2020-03-20 17:50:00')

  const createNewsItemModel = (date: Moment): LocalNewsModel =>
    new LocalNewsModel({
      id: 1,
      title: 'Tick bite - What to do?',
      timestamp: date,
      message:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
    })

  const itemValue = createNewsItemModel(
    moment.tz('2020-03-20 17:50:00', 'GMT')
  )

  const params = { city: 'testumgebung', language: 'en', id: '1' }

  it('should map params to url', () => {
    expect(localNewsElement.mapParamsToUrl(params)).toEqual(
      `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/fcm?id=${params.id}`
    )
  })

  it('should map fetched data to models', () => {
    const itemModel = localNewsElement.mapResponse([item], params)

    expect(itemModel).toEqual(itemValue)
  })
})
