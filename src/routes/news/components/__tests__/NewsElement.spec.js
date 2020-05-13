// @flow

import React from 'react'
import { LocalNewsModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import { shallow } from 'enzyme'
import NewsElement from '../NewsElement'
import { LOCAL_NEWS } from '../../constants'

describe('NewsElement', () => {
  const language = 'en'
  const path = '/testumgebung/en/news/local'
  const t = (key: ?string): string => key || ''

  const date = moment.tz('2020-03-20 17:50:00', 'GMT')
  const newsItem = new LocalNewsModel({
    id: 217,
    title: 'Tick bite - What to do?',
    timestamp: date,
    message:
    'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.'
  })

  const { id, title, message, timestamp } = newsItem

  it('should render and match snapshot', () => {
    expect(shallow(
      <NewsElement id={id} type={LOCAL_NEWS} title={title} content={message} timestamp={timestamp} language={language} t={t} path={path} />
    )).toMatchSnapshot()
  })
})
