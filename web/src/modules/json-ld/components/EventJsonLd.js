// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import { EventModel } from 'api-client'

const createJsonLd = (event: EventModel) => {
  const date = event.date

  // https://developers.google.com/search/docs/data-types/event
  const jsonLd: { endDate?: string, image?: string[] } = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: date.allDay ? date.startDate.format('YYYY-MM-DD') : date.startDate.format(),
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
  event: EventModel
|}

class EventJsonLd extends React.Component<PropsType> {
  render () {
    return <Helmet>
      <script type='application/ld+json'>
        {JSON.stringify(createJsonLd(this.props.event))}
      </script>
    </Helmet>
  }
}

export default EventJsonLd
