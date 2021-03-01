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
  showUpdateText?: boolean,
  formatter: DateFormatter,
  onInternalLinkClick: string => void,
  children?: React.Node
|}

/**
 * Display a single page with all necessary information
 */
const Page = ({
  title,
  defaultThumbnailSrc,
  thumbnailSrcSet,
  content,
  lastUpdate,
  showUpdateText = true,
  formatter,
  children,
  onInternalLinkClick
}: PropsType) => {
  return (
    <>
      {defaultThumbnailSrc && <Thumbnail alt='' src={defaultThumbnailSrc} srcSet={thumbnailSrcSet} />}
      <Caption title={title} />
      {children}
      <RemoteContent dangerouslySetInnerHTML={{ __html: content }}
                     onInternalLinkClick={onInternalLinkClick} />
      {lastUpdate && <LastUpdateInfo lastUpdate={lastUpdate} formatter={formatter} withText={showUpdateText} />}
    </>
  )
}

export default Page
