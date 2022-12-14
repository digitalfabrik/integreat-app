import moment from 'moment'
import { EventModelBuilder } from '../../testing'
import { mapToICalFormat } from '../eventExport'
import EventModel from '../../models/EventModel'
import DateModel from '../../models/DateModel'
import LocationModel from '../../models/LocationModel'

describe('exportEvents', () => {
  const event = new EventModel({
    path: '/augsburg/de/events/event0',
    title: 'Test event',
    content: '<h1> html content </h1>',
    thumbnail: 'event.thumbnail',
    date: new DateModel({
      startDate: moment('2019-03-01T00:00:00.000Z'),
      endDate: moment('2019-03-01T04:10:40.714Z'),
      allDay: false
    }),
    location: new LocationModel({
      id: 1,
      name: 'test',
      address: 'address',
      town: 'town',
      postcode: 'postcode',
      country: 'country',
      latitude: null,
      longitude: null
    }),
    excerpt: 'bal bla bla text',
    availableLanguages: new Map<string, string>([['', '']]),
    lastUpdate: moment('2022-06-05'),
    featuredImage: null
  })

  const mappedEvent = mapToICalFormat(event)
  it('should have iCal format after mapping', () => {
    expect(mappedEvent.startsWith('BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:Integreat-App\nBEGIN:VEVENT')).toBeTruthy()
    expect(mappedEvent.endsWith('END:VEVENT\nEND:VCALENDAR')).toBeTruthy()
  })
  it('should include link into description', () => {
    const contentField = mappedEvent.split('\n')[10]
    expect(contentField !== undefined && contentField.startsWith('DESCRIPTION:https://integreat.app')).toBeTruthy()
  })
  it('should generate generate different UIDs', () => {
    const mappedEvent2 = mapToICalFormat(new EventModelBuilder('seed2', 1, 'augsburg', 'de').build()[0]!)
    const eventUID = mappedEvent.split('\n')[5]
    const event2UID = mappedEvent2.split('\n')[5]
    expect(eventUID).not.toBe(event2UID)
  })
  it('should format dates correctly', () => {
    const eventFields = mappedEvent.split('\n')
    expect(eventFields[7]).toBe(`DTSTART:20190301T010000Z`)
    expect(eventFields[8]).toBe(`DEND:20190301T051000Z`)
  })
})
