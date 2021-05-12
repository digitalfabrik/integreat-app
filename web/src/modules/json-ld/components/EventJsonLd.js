// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import { EventModel } from 'api-client'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

const createJsonLd = (event: EventModel, formatter: DateFormatter) => {
  const date = event.date

  // https://developers.google.com/search/docs/data-types/event
  const jsonLd: { endDate?: string, image?: string[] } = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: date.allDay
      ? formatter.format(date.startDate, { format: 'YYYY-MM-DD' }) // ISO 8601 date format
      : formatter.format(date.startDate, { format: undefined }), // ISO 8601 date-time format
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
        addressRegion: event.location.region,
        addressCountry: event.location.country
      }
    }
  }

  if (date.endDate.isValid()) {
    jsonLd.endDate = date.allDay ? date.endDate.format('YYYY-MM-DD') : date.endDate.format()
  }
  if (event.featuredImage) {
    jsonLd.image = [
      event.featuredImage.thumbnail.url,
      event.featuredImage.medium.url,
      event.featuredImage.large.url,
      event.featuredImage.full.url
    ]
  }
  return jsonLd
}

type PropsType = {|
  event: EventModel,
  formatter: DateFormatter
|}

const EventJsonLd = ({ event, formatter }: PropsType) => {
  return (
    <Helmet>
      <script type='application/ld+json'>{JSON.stringify(createJsonLd(event, formatter))}</script>
    </Helmet>
  )
}

export default EventJsonLd
