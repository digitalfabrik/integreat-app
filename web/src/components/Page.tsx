import { DateTime } from 'luxon'
import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

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
  thumbnailSrcSet?: string
  content: string
  lastUpdate?: DateTime
  showLastUpdateText?: boolean
  onInternalLinkClick: (url: string) => void
  BeforeContent?: ReactNode
  AfterContent?: ReactNode
  Footer?: ReactNode
}

const Page = ({
  title,
  thumbnailSrcSet,
  content,
  lastUpdate,
  showLastUpdateText = true,
  onInternalLinkClick,
  BeforeContent,
  AfterContent,
  Footer,
}: PageProps): ReactElement => (
  <>
    {!!thumbnailSrcSet && <Thumbnail alt='' srcSet={thumbnailSrcSet} />}
    <Caption title={title} />
    {BeforeContent}
    <RemoteContent html={content} onInternalLinkClick={onInternalLinkClick} />
    {AfterContent}
    {lastUpdate && !!content && content.length > 0 && (
      <LastUpdateInfo lastUpdate={lastUpdate} withText={showLastUpdateText} />
    )}
    {Footer}
  </>
)

export default Page
