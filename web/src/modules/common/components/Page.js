// @flow

import * as React from 'react'
import styled from 'styled-components'
import RemoteContent from './RemoteContent'
import Caption from './Caption'
import type Moment from 'moment'
import LastUpdateInfo from './LastUpdateInfo'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

export const THUMBNAIL_WIDTH = 300

const Thumbnail = styled.img`
  display: flex;
  width: ${THUMBNAIL_WIDTH}px;
  height: ${THUMBNAIL_WIDTH}px;
  margin: 10px auto;
  padding-bottom: 10px;
  object-fit: contain;
`

type PropsType = {|
  title: string,
  defaultThumbnailSrc?: string, // necessary for IE11 support
  thumbnailSrcSet?: ?string,
  content: string,
  lastUpdate?: Moment,
  formatter: DateFormatter,
  onInternalLinkClick: string => void,
  children?: React.Node
|}

/**
 * Display a single page with all necessary information
 */
class Page extends React.PureComponent<PropsType> {
  render () {
    const {
      title, defaultThumbnailSrc, thumbnailSrcSet, content, lastUpdate, formatter, children,
      onInternalLinkClick
    } = this.props
    return (
      <>
        {defaultThumbnailSrc && <Thumbnail alt='' src={defaultThumbnailSrc} srcSet={thumbnailSrcSet} />}
        <Caption title={title} />
        {children}
        <RemoteContent dangerouslySetInnerHTML={{ __html: content }}
                       onInternalLinkClick={onInternalLinkClick} />
        {lastUpdate && <LastUpdateInfo lastUpdate={lastUpdate} formatter={formatter} withText />}
      </>
    )
  }
}

export default Page
