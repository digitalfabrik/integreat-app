// @flow

import React from 'react'
import { TunewsModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import { shallow } from 'enzyme'
import PaginatedList from '../PaginatedList'
import TunewsElement from '../TunewsElement'

describe('PaginatedList', () => {
  const language = 'en'
  const path = '/testumgebung/en/news/local'
  const t = (key: ?string): string => key || ''
  const city = 'testcity'

  const renderItem = (language: string) => (item: TunewsModel, city: string) => <TunewsElement
    newsItem={item}
    key={item.id}
    path={path}
    t={t}
    language={language}
    city={city}
  />
  const date1 = moment.tz('2020-03-20 17:50:00', 'GMT')
  const date2 = moment.tz('2020-04-25 17:50:00', 'GMT')

  const tunews = [
    new TunewsModel({
      id: 1,
      title: 'Tick bite - What to do?',
      tags: ['8 Gesundheit'],
      date: date1,
      content: 'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
      eNewsNo: 'tun0000009902'
    }),
    new TunewsModel({
      id: 2,
      title: 'Tick bite - What to do?',
      tags: ['8 Gesundheit'],
      date: date2,
      content: 'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
      eNewsNo: 'tun0000009902'
    })
  ]

  it('should render and match snapshot', () => {
    expect(shallow(
      <PaginatedList
        language={language}
        items={tunews}
        renderItem={renderItem(language)}
        city={city}
        fetchMoreTunews={() => {}}
        hasMore
        isFetching={false}
        noItemsMessage={t('currentlyNoTunews')}
      />
    )).toMatchSnapshot()
  })
})
