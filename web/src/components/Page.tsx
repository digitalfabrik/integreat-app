import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { Moment } from 'moment'

import DateFormatter from 'api-client/src/i18n/DateFormatter'

import Caption from './Caption'
import LastUpdateInfo from './LastUpdateInfo'
import RemoteContent from './RemoteContent'

export const THUMBNAIL_WIDTH = 300

const Thumbnail = styled.img`
  display: flex;
  width: ${THUMBNAIL_WIDTH}px;
  height: ${THUMBNAIL_WIDTH}px;
  margin: 10px auto;
  padding-bottom: 10px;
  object-fit: contain;
`

type PropsType = {
  title: string
  defaultThumbnailSrc?: string // necessary for IE11 support
  thumbnailSrcSet?: string
  content: string
  lastUpdate?: Moment
  showLastUpdateText?: boolean
  lastUpdateFormat?: string
  formatter: DateFormatter
  onInternalLinkClick: (url: string) => void
  children?: ReactNode
}

/**
 * Display a single page with all necessary information
 */
const Page = ({
  title,
  defaultThumbnailSrc,
  thumbnailSrcSet,
  content,
  lastUpdate,
  showLastUpdateText = true,
  lastUpdateFormat,
  formatter,
  children,
  onInternalLinkClick
}: PropsType): ReactElement => {
  return (
    <>
      {defaultThumbnailSrc && <Thumbnail alt='' src={defaultThumbnailSrc} srcSet={thumbnailSrcSet} />}
      <Caption title={title} />
      {children}
      <RemoteContent html={content} onInternalLinkClick={onInternalLinkClick} />
      {lastUpdate && (
        <LastUpdateInfo
          lastUpdate={lastUpdate}
          format={lastUpdateFormat}
          formatter={formatter}
          withText={showLastUpdateText}
        />
      )}
    </>
  )
}

export default Page
