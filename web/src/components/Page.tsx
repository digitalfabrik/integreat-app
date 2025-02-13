import { DateTime } from 'luxon'
import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import useTtsPlayer from '../hooks/useTtsPlayer'
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

const SpaceForTts = styled.div<{ $ttsPlayerVisible: boolean }>`
  height: ${props => (props.$ttsPlayerVisible ? dimensions.ttsPlayerHeight : 0)}px;
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
}: PageProps): ReactElement => {
  const { visible: ttsPlayerVisible } = useTtsPlayer()
  return (
    <>
      {!!thumbnailSrcSet && <Thumbnail alt='' srcSet={thumbnailSrcSet} />}
      <Caption title={title} />
      {BeforeContent}
      <RemoteContent html={content} />
      {AfterContent}
      {lastUpdate && !!content && content.length > 0 && (
        <LastUpdateInfo lastUpdate={lastUpdate} withText={showLastUpdateText} />
      )}
      {Footer}
      <SpaceForTts $ttsPlayerVisible={ttsPlayerVisible} />
    </>
  )
}

export default Page
