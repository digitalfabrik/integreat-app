// @flow

import moment from 'moment-timezone'
import createTuNewsElementEndpoint from '../createTuNewsElementEndpoint'
import TuNewsElementModel from '../../models/TuNewsElementModel'
import type { JsonTuNewsType } from '../../types'
import type Moment from 'moment'

describe('tunews', () => {
  const baseUrl = 'https://cms-test.integreat-app.de'
  const tuNewsElement = createTuNewsElementEndpoint(baseUrl)

  const createNewsItem = (id, date): JsonTuNewsType => ({
    id,
    title: 'Tick bite - What to do?',
    tags: ['8 Gesundheit'],
    date: date,
    content: 'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
    enewsno: 'tun0000009902'
  })

  const item1 = createNewsItem(1, '2020-01-20 12:04:22+00:00')

  const createNewsItemModel = (id, date: Moment): TuNewsElementModel => new TuNewsElementModel({
    id,
    title: 'Tick bite - What to do?',
    tags: ['8 Gesundheit'],
    date: date,
    content: 'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
    enewsno: 'tun0000009902'
  })

  const itemModel1 = createNewsItemModel(1,
    moment.tz('2020-01-20 12:04:22+00:00', 'GMT'))

  const params = {id: 1}

  it('should map params to url', () => {
    expect(tuNewsElement.mapParamsToUrl(params)).toEqual(
      `${baseUrl}/v1/news/${params.id}`
    )
  })

  it('should map fetched data to models', () => {
    const itemModel = tuNewsElement.mapResponse(item1, params)

    expect(itemModel).toEqual(itemModel1)
  })
})
