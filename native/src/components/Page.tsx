import { DateTime } from 'luxon'
import React, { ReactElement, ReactNode, useCallback, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import dimensions, { getPageContainerPaddingHorizontal } from '../constants/dimensions'
import useTtsPlayer from '../hooks/useTtsPlayer'
import Caption from './Caption'
import RemoteContent from './RemoteContent'
import TimeStamp from './TimeStamp'

const Container = styled.View<{ $padding: boolean; $paddingHorizontal: number }>`
  ${props => props.$padding && `padding: 0 ${props.$paddingHorizontal}px 8px;`}
`
const SpaceForTts = styled.View<{ $ttsPlayerVisible: boolean }>`
  height: ${props => (props.$ttsPlayerVisible ? dimensions.ttsPlayerHeight : 0)}px;
`

type PageProps = {
  title?: string
  content: string
  beforeContent?: ReactNode
  afterContent?: ReactNode
  footer?: ReactNode
  language: string
  lastUpdate?: DateTime
  padding?: boolean
}

const Page = ({
  title,
  content,
  beforeContent,
  afterContent,
  footer,
  language,
  lastUpdate,
  padding = true,
}: PageProps): ReactElement => {
  const [loading, setLoading] = useState(content.length !== 0)
  const { visible: ttsPlayerVisible } = useTtsPlayer()
  const { width } = useWindowDimensions()
  const paddingHorizontal = getPageContainerPaddingHorizontal(width)

  const onLoad = useCallback(() => setLoading(false), [setLoading])

  return (
    <Container $padding={padding} $paddingHorizontal={paddingHorizontal}>
      {!loading && title ? <Caption title={title} language={language} /> : null}
      {!loading && beforeContent}
      <RemoteContent content={content} onLoad={onLoad} loading={loading} language={language} />
      {!loading && afterContent}
      {!loading && !!content && lastUpdate && <TimeStamp lastUpdate={lastUpdate} />}
      {!loading && footer}
      <SpaceForTts $ttsPlayerVisible={ttsPlayerVisible} />
    </Container>
  )
}

export default Page
