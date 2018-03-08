import React from 'react'

import withFetcher from '../../endpoint/hocs/withFetcher'
import HeaderNavigationItem from '../components/HeaderNavigationItem'

class LocationHeaderEventsNavigationItem extends React.PureComponent {
  render () {
    const EventsInactive = () => <HeaderNavigationItem {...this.props} active={false} />
    const EventsFetched = ({events}) => <HeaderNavigationItem {...this.props} active={events.length > 0} />
    const EventsNavigationItem = withFetcher('events', EventsInactive, EventsInactive)(EventsFetched)
    return <EventsNavigationItem />
  }
}

export default LocationHeaderEventsNavigationItem
