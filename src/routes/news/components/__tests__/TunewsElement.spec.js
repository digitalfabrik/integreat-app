// @flow

import React from 'react'
import { TunewsModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import { shallow } from 'enzyme'
import TunewsElement from '../TunewsElement'

describe('TunewsElement', () => {
  const language = 'en'
  const city = 'testumgebung'
  const path = '/testumgebung/en/news/tu-news'
  const t = (key: ?string): string => key || ''

  const date = moment.tz('2020-03-20 17:50:00', 'GMT')
  const newsItem = new TunewsModel({
    id: 1,
    title: 'Tick bite - What to do?',
    tags: ['8 Gesundheit'],
    date: date,
    content: 'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
    eNewsNo: 'tun0000009902'
  })

  it('should render and match snapshot', () => {
    expect(shallow(
      <TunewsElement
        newsItem={newsItem}
        key={newsItem.id}
        path={path}
        t={t}
        language={language}
        city={city}
      />
    )).toMatchSnapshot()
  })
})
