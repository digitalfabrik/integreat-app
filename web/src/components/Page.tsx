import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement, ReactNode } from 'react'

import LastUpdateInfo from './LastUpdateInfo'
import RemoteContent from './RemoteContent'
import H1 from './base/H1'

export const THUMBNAIL_WIDTH = 300

const Thumbnail = styled('img')`
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
  BeforeContent,
  AfterContent,
  Footer,
}: PageProps): ReactElement => (
  <Stack direction='column'>
    {!!thumbnailSrcSet && <Thumbnail alt='' srcSet={thumbnailSrcSet} />}
    <H1>{title}</H1>
    {BeforeContent}
    <RemoteContent html={content} />
    {AfterContent}
    {lastUpdate && !!content && content.length > 0 && (
      <LastUpdateInfo lastUpdate={lastUpdate} withText={showLastUpdateText} />
    )}
    {Footer}
  </Stack>
)

export default Page
