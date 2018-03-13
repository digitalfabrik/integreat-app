import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from '../../endpoint/hocs/withFetcher'
import HeaderNavigationItem from '../components/HeaderNavigationItem'
import { isEmpty } from 'lodash/lang'
import EventModel from '../../endpoint/models/EventModel'

export class EventsNavigationItem extends React.PureComponent {
  static propTypes = {
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel))
  }

  render () {
    const {href, events, text, tooltip, selected} = this.props
    return <HeaderNavigationItem href={href} selected={selected} text={text} tooltip={tooltip}
                                 active={!isEmpty(events)} />
  }
}

export default withFetcher('events', EventsNavigationItem, EventsNavigationItem)(EventsNavigationItem)
