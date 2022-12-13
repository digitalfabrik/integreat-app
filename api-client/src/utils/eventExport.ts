import moment, { Moment } from 'moment'
import { EventModel } from '../index'


const formatDate = (date: Moment): string => `${date.format('YYYYMMDDTHHmm')}00Z`

const generateUID = (): string => {
  let generatedID = ''
  const length = 20
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i += 1) {
    generatedID += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return `${generatedID}@integreat.de`
}

export const mapToICalFormat = (event: EventModel): string => {
  const body: string[] = []
  body.push(`DTSTAMP:${formatDate(moment())}`)
  body.push(`UID:${generateUID()}`)
  body.push(`SUMMARY:${event.title}`)
  body.push(`DTSTART:${formatDate(event.date.startDate)}`)
  body.push(`DEND:${formatDate(event.date.endDate)}`)
  if (event.location) {
    body.push(`LOCATION:${event.location.fullAddress}`)
  }

  // we can't include the actual content because in some cases it can lead to an import error (not trivial to fix).
  // That's why we link to the website instead
  if (event.path) {
    body.push(`DESCRIPTION:https://integreat.app${event.path}`)
  }

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

