import moment from 'moment-timezone'
import createTunewsElementEndpoint from '../createTunewsElementEndpoint'
import TunewsModel from '../../models/TunewsModel'
import type { JsonTunewsType } from '../../types'
import type Moment from 'moment'
describe('tunews', () => {
  const baseUrl = 'https://cms-test.integreat-app.de'
  const tunewsElement = createTunewsElementEndpoint(baseUrl)

  const createNewsItem = (id, date): JsonTunewsType => ({
    id,
    title: 'Tick bite - What to do?',
    tags: ['8 Gesundheit'],
    date: date,
    content:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
    enewsno: 'tun0000009902'
  })

  const item1 = createNewsItem(1, '2020-01-20 12:04:22+00:00')

  const createNewsItemModel = (id, date: Moment): TunewsModel =>
    new TunewsModel({
      id,
      title: 'Tick bite - What to do?',
      tags: ['8 Gesundheit'],
      date: date,
      content:
        'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
      eNewsNo: 'tun0000009902'
    })

  const itemModel1 = createNewsItemModel(1, moment.tz('2020-01-20 12:04:22+00:00', 'GMT'))
  const params = {
    city: 'augsburg',
    language: 'de',
    id: 1
  }
  it('should map params to url', () => {
    expect(tunewsElement.mapParamsToUrl(params)).toEqual(`${baseUrl}/v1/news/${params.id}`)
  })
  it('should map fetched data to models', () => {
    const itemModel = tunewsElement.mapResponse(item1, params)
    expect(itemModel).toEqual(itemModel1)
  })
  it('should throw a not found error if the response is empty', () => {
    expect(() => tunewsElement.mapResponse([], params)).toThrowError('The tu-news 1 does not exist here.')
  })
})