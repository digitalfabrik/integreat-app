import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { Event, WithContext } from 'schema-dts'

import { EventModel } from 'api-client'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

export const createJsonLd = (event: EventModel, formatter: DateFormatter): WithContext<Event> | null => {
  if (!event.location) {
    return null
  }
  const date = event.date
  // https://developers.google.com/search/docs/data-types/event
  const jsonLd: WithContext<Event> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: date.allDay
      ? formatter.format(date.startDate, {
          format: 'MM-dd-yyyy',
        }) // ISO 8601 date format
      : formatter.format(date.startDate, {
          format: 'DDD',
        }),
    // ISO 8601 date-time format
    eventStatus: 'https://schema.org/EventScheduled',
    description: event.excerpt,
    location: {
      '@type': 'Place',
      name: event.location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.location.address,
        addressLocality: event.location.town,
        postalCode: event.location.postcode,
        addressCountry: event.location.country,
      },
    },
  }

  if (date.endDate.isValid) {
    jsonLd.endDate = date.allDay ? date.endDate.toUTC().toFormat('ff') : date.endDate.toUTC().toISO() ?? ''
  }

  if (event.featuredImage) {
    jsonLd.image = [
      event.featuredImage.thumbnail.url,
      event.featuredImage.medium.url,
      event.featuredImage.large.url,
      event.featuredImage.full.url,
    ]
  }
  return jsonLd
}

type JsonLdEventProps = {
  event: EventModel
  formatter: DateFormatter
}

const JsonLdEvent = ({ event, formatter }: JsonLdEventProps): ReactElement | null => {
  const jsonLd = createJsonLd(event, formatter)
  if (!jsonLd) {
    return null
  }
  return (
    <Helmet>
      <script type='application/ld+json'>{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}

export default JsonLdEvent
