// @flow

import React from 'react'
import { LocalNewsModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import { shallow } from 'enzyme'
import NewsList from '../NewsList'
import NewsElement from '../NewsElement'

describe('NewsList', () => {
  const language = 'en'
  const path = '/testumgebung/en/news/local'
  const t = (key: ?string): string => key || ''
  const city = 'testcity'

  const renderItem = (localNews1, city) => <NewsElement
    newsItem={localNews1}
    key={localNews1.id}
    path={path}
    t={t}
    language={language}
  />
  const date = moment.tz('2020-03-20 17:50:00', 'GMT')
  const localNews1 = new LocalNewsModel({
    id: 217,
    title: 'Tick bite - What to do?',
    timestamp: date,
    message:
    'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
  })

  const localNews2 = new LocalNewsModel({
    id: 218,
    title: 'Tick bite - What to do?',
    timestamp: date,
    message:
    'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
  })

  const items = [localNews1, localNews2]

  it('should render and match snapshot', () => {
    expect(shallow(
      <NewsList items={items} renderItem={renderItem} city={city} noItemsMessage='no item' />
    )).toMatchSnapshot()
  })
})
