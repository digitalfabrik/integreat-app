import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement, ReactNode } from 'react'

import useDimensions from '../hooks/useDimensions'
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
  titleAdornment?: ReactElement
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
  titleAdornment,
  thumbnailSrcSet,
  content,
  lastUpdate,
  showLastUpdateText = true,
  beforeContent,
  afterContent,
  footer,
}: PageProps): ReactElement => {
  const { mobile } = useDimensions()
  return (
    <Stack direction='column'>
      {!!thumbnailSrcSet && <Thumbnail alt='' srcSet={thumbnailSrcSet} />}
      {titleAdornment ? (
        <Stack direction={mobile ? 'column-reverse' : 'row'} sx={{ gap: 1 }}>
          <H1 sx={mobile ? { marginTop: 0 } : undefined}>{title}</H1>
          {titleAdornment}
        </Stack>
      ) : (
        <H1>{title}</H1>
      )}
      {beforeContent}
      <RemoteContent html={content} />
      {afterContent}
      {lastUpdate && !!content && content.length > 0 && (
        <LastUpdateInfo lastUpdate={lastUpdate} withText={showLastUpdateText} />
      )}
      {footer}
    </Stack>
  )
}

export default Page
