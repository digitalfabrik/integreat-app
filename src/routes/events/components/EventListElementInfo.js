// @flow

import React from 'react'
import DateModel from '../../../modules/endpoint/models/DateModel'
import LocationModel from '../../../modules/endpoint/models/LocationModel'
import RemoteContent from '../../../modules/common/components/RemoteContent'

const EXCERPT_LENGTH = 70

type PropsType = {|
  date?: DateModel,
  location: LocationModel,
  excerpt: string,
  language: string,
  onInternalLinkClick: string => void
|}

class EventListElementInfo extends React.Component<PropsType> {
  formatExcerpt (excerptLength: number): string {
    return `${this.props.excerpt.slice(0, excerptLength)}...`
  }

  render () {
    const {date, location, onInternalLinkClick, language} = this.props
    return (
      <>
        <div>
          <div>{date.toFormattedString(language)}</div>
          <div>{location.location}</div>
        </div>
        <RemoteContent dangerouslySetInnerHTML={{__html: this.formatExcerpt(EXCERPT_LENGTH)}}
                       onInternLinkClick={onInternalLinkClick} />
      </>
    )
  }
}

export default EventListElementInfo
