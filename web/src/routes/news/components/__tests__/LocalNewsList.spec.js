// @flow

import React from 'react'
import { LocalNewsModel } from 'api-client'
import moment from 'moment'
import { shallow } from 'enzyme'
import LocalNewsList from '../LocalNewsList'
import NewsElement from '../NewsElement'
import { LOCAL_NEWS } from '../../constants'

describe('LocalNewsList', () => {
  const language = 'en'
  const link = '/testumgebung/en/news/local'
  const t = (key: ?string): string => key || ''
  const city = 'testcity'

  const renderItem = ({ id, title, message, timestamp }, city) => <NewsElement
    title={title}
    content={message}
    timestamp={timestamp}
    type={LOCAL_NEWS}
    key={localNews1.id}
    link={link}
    t={t}
    language={language}
  />
  const date = moment('2017-11-18T09:30:00.000Z')
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

  it('should have two NewsElement', () => {
    const localNewsList = shallow(
      <LocalNewsList items={items} renderItem={renderItem} city={city} noItemsMessage='no item' />
    ).dive()
    const newsElementList = localNewsList.find('NewsElement')

    expect(newsElementList).toHaveLength(2)
    expect(newsElementList.find({ id: 217 })).toHaveLength(1)
  })

  it('should render "noItemsMessage" if the items is an empty array', () => {
    const localNewsList = shallow(
      <LocalNewsList items={[]} renderItem={renderItem} city={city} noItemsMessage='No items' />
    ).dive()

    const noItemsMessage = localNewsList.text()
    expect(noItemsMessage).toEqual('No items')
  })
})
