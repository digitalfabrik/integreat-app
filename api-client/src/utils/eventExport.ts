import moment, { Moment } from 'moment'
import { EventModel } from '../index'


const formatDate = (date: Moment): string => `${date.format('YYYYMMDDTHHmm')}00Z`

// TODO new CalendarEvent with the $recurringEvent set should have the same UID as its recurring event.
const generateUID = (): string => {
  let generatedID = ''
  const length = 20
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  for (let i = 0; i < length; i += 1) {
    generatedID += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return `${generatedID}@integreat.de`
}

// TODO check formatting
export const mapToICalFormat = (event: EventModel): string => {
  const body: string[] = []
  body.push(`DSTAMP:${formatDate(moment())}`)
  // body.push(`UID:${generateUID()}`)
  body.push('UID:ff808181-00000003@example.com')
  body.push(`SUMMARY:${event.title}`)
  body.push(`DTSTART:${formatDate(event.date.startDate)}`)
  body.push(`DEND:${formatDate(event.date.endDate)}`)
  if (event.location) {
    body.push(`LOCATION:${event.location.fullAddress}`)
  }

  // TODO escape html?
  // https://www.npmjs.com/package/html-to-text
  if (event.content) {
    body.push(`DESCRIPTION:${event.content}`)
  }


  // TODO check if \n is ok
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:Integreat-App',
    'BEGIN:VEVENT',
    body.join('\n'),
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n')
}


/*
BEGIN:VCALENDAR
VERSION:2.0
PRODID:Integreat-App
BEGIN:VEVENT
DTSTAMP:20221125T000000Z
UID:ff808181-00000003@example.com
DTSTART:20221127T000000Z
DTEND:20220529T013000Z
SUMMARY:Test-Veranstaltung tel
WWK Arena, Bürgermeister-Ulrich-Straße 90, 86199 Augsburg
END:VEVENT
END:VCALENDAR
*/
