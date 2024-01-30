import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import { EventModelBuilder } from '../../testing'
import DateModel from '../DateModel'
import EventModel from '../EventModel'
import LocationModel from '../LocationModel'

describe('EventModel', () => {
  const event = new EventModel({
    path: '/augsburg/de/events/event0',
    title: 'Test event',
    content: '<h1> html content </h1>',
    thumbnail: 'event.thumbnail',
    date: new DateModel({
      startDate: DateTime.fromISO('2020-03-20T10:50:00+02:00'),
      endDate: DateTime.fromISO('2020-03-20T17:50:00+02:00'),
      allDay: false,
      recurrenceRule: rrulestr('FREQ=WEEKLY;INTERVAL=3;UNTIL=20200703T235959Z;BYDAY=FR'),
    }),
    location: new LocationModel({
      id: 1,
      name: 'test',
      address: 'address',
      town: 'town',
      postcode: 'postcode',
      country: 'country',
      latitude: null,
      longitude: null,
    }),
    excerpt: 'bal bla bla text',
    availableLanguages: new Map<string, string>([['', '']]),
    lastUpdate: DateTime.fromISO('2022-06-05T17:50:00+02:00'),
    featuredImage: null,
  })
  const baseUrl = 'https://example.com'
  const appName = 'Integreat-App'
  const iCalEvent = event.toICal(baseUrl, appName, false)

  it('should have correct iCal basic format', () => {
    expect(iCalEvent.startsWith(`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:${appName}\nBEGIN:VEVENT`)).toBeTruthy()
    expect(iCalEvent.endsWith('END:VEVENT\nEND:VCALENDAR')).toBeTruthy()
  })

  it('should include excerpt and link in description of iCal', () => {
    const contentField = iCalEvent.split('\n')[9]!
    expect(contentField.startsWith(`DESCRIPTION:${event.excerpt}`)).toBeTruthy()
    expect(contentField.includes(`${baseUrl}${event.path}`)).toBeTruthy()
  })

  it('should have different UIDs in iCal', () => {
    const event2 = new EventModelBuilder('seed2', 1, 'augsburg', 'de').build()[0]!
    const iCalEvent2 = event2.toICal(baseUrl, appName, false)
    const eventUID = iCalEvent.split('\n')[5]
    const event2UID = iCalEvent2.split('\n')[5]
    expect(eventUID).not.toBe(event2UID)
  })

  it('should have dates formatted correctly in iCal', () => {
    const timezone = event.date.startDate.zone.name
    const eventFields = iCalEvent.split('\n')
    expect(eventFields[7]).toBe(`DTSTART;TZID=${timezone}:20200320T095000`)
    expect(eventFields[8]).toBe(`DTEND;TZID=${timezone}:20200320T165000`)
  })

  it('should have recurrence rule in iCal', () => {
    const recurringEvent = event.toICal(baseUrl, appName, true)
    const recurrenceField = recurringEvent.split('\n')[11]
    expect(recurrenceField).toBe('RRULE:FREQ=WEEKLY;INTERVAL=3;UNTIL=20200703T235959Z;BYDAY=FR')
  })
})
