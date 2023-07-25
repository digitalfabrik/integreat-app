import { Moment } from 'moment'
import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

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

type PageProps = {
  title: string
  defaultThumbnailSrc?: string // necessary for IE11 support
  thumbnailSrcSet?: string
  content: string
  lastUpdate?: Moment
  showLastUpdateText?: boolean
  lastUpdateFormat?: string
  formatter: DateFormatter
  onInternalLinkClick: (url: string) => void
  BeforeContent?: ReactNode
  AfterContent?: ReactNode
  Footer?: ReactNode
}

const Page = ({
  title,
  defaultThumbnailSrc,
  thumbnailSrcSet,
  content,
  lastUpdate,
  showLastUpdateText = true,
  lastUpdateFormat,
  formatter,
  onInternalLinkClick,
  BeforeContent,
  AfterContent,
  Footer,
}: PageProps): ReactElement => (
  <>
    {!!defaultThumbnailSrc && <Thumbnail alt='' src={defaultThumbnailSrc} srcSet={thumbnailSrcSet} />}
    <Caption title={title} />
    {BeforeContent}
    <RemoteContent html={content} onInternalLinkClick={onInternalLinkClick} />
    {AfterContent}
    {lastUpdate && (
      <LastUpdateInfo
        lastUpdate={lastUpdate}
        format={lastUpdateFormat}
        formatter={formatter}
        withText={showLastUpdateText}
      />
    )}
    {Footer}
  </>
)

export default Page
