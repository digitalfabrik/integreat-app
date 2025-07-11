import { DateTime } from 'luxon'

import { API_VERSION } from '../../constants'
import LocalNewsModel from '../../models/LocalNewsModel'
import { JsonLocalNewsType } from '../../types'
import createLocalNewsElementEndpoint from '../createLocalNewsElementEndpoint'

describe('localnews', () => {
  const baseUrl = 'https://cms.integreat-app.de'
  const localNewsElement = createLocalNewsElementEndpoint(baseUrl)

  const createNewsItem = (date: string): JsonLocalNewsType => ({
    id: 1,
    title: 'Tick bite - What to do?',
    display_date: date,
    message:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.',
    available_languages: { de: { id: 1234 } },
  })

  const item = createNewsItem('2020-03-20T17:50:00+02:00')

  const createNewsItemModel = (date: DateTime): LocalNewsModel =>
    new LocalNewsModel({
      id: 1,
      title: 'Tick bite - What to do?',
      timestamp: date,
      content:
        'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.',
      availableLanguages: { de: 1234 },
    })

  const itemValue = createNewsItemModel(DateTime.fromISO('2020-03-20T17:50:00+02:00'))
  const params = {
    city: 'testumgebung',
    language: 'en',
    id: '1',
  }
  it('should map params to url', () => {
    expect(localNewsElement.mapParamsToUrl(params)).toBe(
      `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/fcm/?id=${params.id}`,
    )
  })
  it('should map fetched data to models', () => {
    const itemModel = localNewsElement.mapResponse([item], params)
    expect(itemModel).toEqual(itemValue)
  })
  it('should throw if response is empty', () => {
    expect(() => localNewsElement.mapResponse([], params)).toThrow('The local 1 does not exist here.')
  })
  it('should throw a not found error if the response contains more than one item', () => {
    expect(() => localNewsElement.mapResponse([item, item], params)).toThrow()
  })
})
