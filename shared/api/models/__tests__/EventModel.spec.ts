import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import { EventModelBuilder } from '../../endpoints/testing'
import DateModel from '../DateModel'
import EventModel from '../EventModel'
import LocationModel from '../LocationModel'

jest.useFakeTimers({ now: new Date('2023-10-02T15:23:57.443+02:00') })

describe('EventModel', () => {
  const params = {
    path: '/augsburg/de/events/event0',
    title: 'Test event',
    content: '<h1> html content </h1>',
    thumbnail: 'event.thumbnail',
    date: new DateModel({
      startDate: DateTime.fromISO('2020-03-20T10:50:00+02:00'),
      endDate: DateTime.fromISO('2020-03-20T17:50:00+02:00'),
      allDay: false,
      recurrenceRule: rrulestr('FREQ=WEEKLY;INTERVAL=3;UNTIL=20200703T235959Z;BYDAY=-1FR'),
      onlyWeekdays: false,
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
    availableLanguages: {},
    lastUpdate: DateTime.fromISO('2022-06-05T17:50:00+02:00'),
    featuredImage: null,
    poiPath: '/testumgebung/de/locations/testort/',
  }
  const event = new EventModel(params)
  const baseUrl = 'https://example.com'
  const appName = 'Integreat-App'
  const iCalEvent = event.toICal(baseUrl, appName, false)
  const getICalField = (event: EventModel, field: string, recurring = false): string =>
    event
      .toICal(baseUrl, appName, recurring)
      .split('\n')
      .find(it => it.startsWith(field))!

  it('should have correct iCal basic format', () => {
    expect(iCalEvent.startsWith(`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:${appName}\nBEGIN:VEVENT`)).toBeTruthy()
    expect(iCalEvent.endsWith('END:VEVENT\nEND:VCALENDAR')).toBeTruthy()
  })

  it('should include excerpt and link in description of iCal', () => {
    const description = getICalField(event, 'DESCRIPTION')
    expect(description.startsWith(`DESCRIPTION:${event.excerpt}`)).toBeTruthy()
    expect(description.includes(`${baseUrl}${event.path}`)).toBeTruthy()
  })

  it('should have different UIDs in iCal', () => {
    const event2 = new EventModelBuilder('seed2', 1, 'augsburg', 'de').build()[0]!
    const uid1 = getICalField(event, 'UID')
    const uid2 = getICalField(event2, 'UID')
    expect(uid1).not.toBe(uid2)
  })

  it('should have dates formatted correctly in iCal', () => {
    const timezone = event.date.startDate.zone.name
    const startDate = getICalField(event, 'DTSTART')
    const endDate = getICalField(event, 'DTEND')
    expect(startDate).toBe(`DTSTART;TZID=${timezone}:20200320T095000`)
    expect(endDate).toBe(`DTEND;TZID=${timezone}:20200320T165000`)
  })

  it('should have the correct recurrence rule in iCal', () => {
    const recurrenceField = getICalField(event, 'RRULE', true)
    expect(recurrenceField).toBe('RRULE:FREQ=WEEKLY;INTERVAL=3;UNTIL=20200703T235959Z;BYDAY=-1FR')
  })

  it('should correctly strip carriage returns and escape new lines in ical description', () => {
    const event = new EventModel({
      ...params,
      excerpt: `
        &#160;
    Wer darf teilnehmen?
      Alle Frauen sind herzlich willkommen.
      Was machen wir genau?

      Yoga
      Stretching
    Dancing

    Das Angebot ist kostenlos
    Bitte melden Sie sich:
      &#160;
    anmeldung@invia-augbsurg.de
    08214494625
    Informationen bez&#252;glich des Orts erhalten Sie nach der Anmeldung
    &#160;
      `,
    })
    const description = getICalField(event, 'DESCRIPTION')
    expect(encodeURI(description)).toBe(
      'DESCRIPTION:Wer%20darf%20teilnehmen?%5Cn%20%20%20%20%20%20Alle%20Frauen%20sind%20herzlich%20willkommen.%5Cn%20%20%20%20%20%20Was%20machen%20wir%20genau?%5Cn%5Cn%20%20%20%20%20%20Yoga%5Cn%20%20%20%20%20%20Stretching%5Cn%20%20%20%20Dancing%5Cn%5Cn%20%20%20%20Das%20Angebot%20ist%20kostenlos%5Cn%20%20%20%20Bitte%20melden%20Sie%20sich:%5Cn%20%20%20%20%20%20%C2%A0%5Cn%20%20%20%20anmeldung@invia-augbsurg.de%5Cn%20%20%20%2008214494625%5Cn%20%20%20%20Informationen%20bez%C3%BCglich%20des%20Orts%20erhalten%20Sie%20nach%20der%20Anmeldung%5Cn%5Cnhttps://example.com/augsburg/de/events/event0',
    )
  })

  it('should have a location path', () => {
    expect(event.poiPath).toBe('/testumgebung/de/locations/testort/')
  })
})
