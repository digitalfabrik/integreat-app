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
  beforeContent?: ReactNode
  afterContent?: ReactNode
  footer?: ReactNode
}

const Page = ({
  title,
  thumbnailSrcSet,
  content,
  lastUpdate,
  showLastUpdateText = true,
  beforeContent,
  afterContent,
  footer,
}: PageProps): ReactElement => (
  <Stack direction='column'>
    {!!thumbnailSrcSet && <Thumbnail alt='' srcSet={thumbnailSrcSet} />}
    <H1>{title}</H1>
    {beforeContent}
    <RemoteContent html={content} />
    {afterContent}
    {lastUpdate && !!content && content.length > 0 && (
      <LastUpdateInfo lastUpdate={lastUpdate} withText={showLastUpdateText} />
    )}
    {footer}
  </Stack>
)

export default Page
