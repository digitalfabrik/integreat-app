// @flow

import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import lightTheme from '../../../../modules/theme/constants'
import EventModelBuilder from 'api-client/src/testing/EventModelBuilder'
import EventPlaceholder1 from '../../assets/EventPlaceholder1.jpg'
import EventPlaceholder2 from '../../assets/EventPlaceholder2.jpg'
import EventPlaceholder3 from '../../assets/EventPlaceholder3.jpg'
import EventListItem from '../EventListItem'
import ListItem from '../../../../modules/common/components/ListItem'
import { DateModel, EventModel, LocationModel } from 'api-client'
import moment from 'moment'

jest.mock('rn-fetch-blob')

describe('EventListItem', () => {
  const city = 'augsburg'
  const language = 'de'
  const theme = lightTheme

  it('should use a thumbnail if present', () => {
    const events = new EventModelBuilder('thumbnail', 1, city, language).build()
    const event = events[0]
    const navigateTo = jest.fn()

    const result = TestRenderer.create(
      <EventListItem cityCode={city} event={event} language={language} navigateTo={navigateTo} theme={theme} />
    )

    expect(() => result.root.findByType(ListItem)).not.toThrowError()
    const listItem = result.root.findByType(ListItem)
    expect(listItem.props.thumbnail).toEqual(event.thumbnail)
  })

  it('should use a placeholder if not thumbnail present', () => {
    const event = new EventModel({
      path: '/augsburg/de/events/ev1',
      title: 'Event1',
      content: 'lul',
      excerpt: 'lul',
      thumbnail: null,
      featuredImage: null,
      availableLanguages: new Map([['en', '/augsburg/en/events/ev1']]),
      lastUpdate: moment('2017-11-18 19:30:00', moment.ISO_8601),
      date: new DateModel({
        startDate: moment('2000-01-05T10:10:00.000Z'),
        endDate: moment('2000-01-05T10:10:00.000Z'),
        allDay: false
      }),
      hash: '123456',
      location: Object.create(LocationModel)
    })
    const navigateTo = jest.fn()
    const result = TestRenderer.create(
      <EventListItem cityCode={city} event={event} language={language} navigateTo={navigateTo} theme={theme} />
    )

    expect(() => result.root.findByType(ListItem)).not.toThrowError()
    const listItem = result.root.findByType(ListItem)
    expect([EventPlaceholder1, EventPlaceholder2, EventPlaceholder3]).toContain(listItem.props.thumbnail)
  })
})
