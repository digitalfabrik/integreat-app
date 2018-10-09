// @flow

import * as React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import RemoteContent from './RemoteContent'
import Caption from './Caption'
import DateModel from '../../endpoint/models/DateModel'
import LocationModel from '../../endpoint/models/LocationModel'
import type Moment from 'moment'
import LastUpdateInfo from './LastUpdateInfo'

const Thumbnail = styled.img`
  display: flex;
  width: 300px;
  height: 300px;
  margin: 10px auto;
  padding-bottom: 10px;
  object-fit: contain;
`

const Identifier = styled.span`
  font-weight: 700;
`

type PropsType = {|
  date?: DateModel,
  location?: LocationModel,
  title: string,
  thumbnail?: string,
  content: string,
  lastUpdate: Moment,
  language: string,
  t: TFunction,
  onInternalLinkClick: string => void,
  hijackRegExp?: RegExp
|}

/**
 * Display a single page with all necessary information
 */
export class PageDetail extends React.Component<PropsType> {
  renderDate (): React.Node {
    const {date, language, t} = this.props
    if (date) {
      return (
        <div>
          <Identifier>{t('date')}: </Identifier>
          <span>{date.toFormattedString(language)}</span>
        </div>
      )
    }
  }

  renderLocation (): React.Node {
    const {location, t} = this.props
    if (location) {
      return (
        <div>
          <Identifier>{t('location')}: </Identifier>
          <span>{location.location}</span>
        </div>
      )
    }
  }

  render () {
    const {title, thumbnail, content, lastUpdate, language, hijackRegExp, onInternalLinkClick} = this.props
    return (
      <>
        {thumbnail && <Thumbnail src={thumbnail} />}
        <Caption title={title} />
        {this.renderDate()}
        {this.renderLocation()}
        <RemoteContent dangerouslySetInnerHTML={{__html: content}}
                       onInternLinkClick={onInternalLinkClick}
                       hijackRegExp={hijackRegExp} />
        <LastUpdateInfo lastUpdate={lastUpdate} language={language} />
      </>
    )
  }
}

export default translate('common')(PageDetail)
