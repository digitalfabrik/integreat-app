import { DateTime } from 'luxon'
import React, { ReactElement, ReactNode, useCallback, useState } from 'react'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
import useNavigateToLink from '../hooks/useNavigateToLink'
import useTtsPlayer from '../hooks/useTtsPlayer'
import Caption from './Caption'
import RemoteContent from './RemoteContent'
import TimeStamp from './TimeStamp'

const Container = styled.View<{ $padding: boolean }>`
  ${props => props.$padding && `padding: 0 ${dimensions.pageContainerPaddingHorizontal}px 8px;`}
`
const SpaceForTts = styled.View<{ $ttsPlayerVisible: boolean }>`
  height: ${props => (props.$ttsPlayerVisible ? dimensions.ttsPlayerHeight : 0)}px;
`

type PageProps = {
  title?: string
  content: string
  BeforeContent?: ReactNode
  AfterContent?: ReactNode
  Footer?: ReactNode
  language: string
  lastUpdate?: DateTime
  padding?: boolean
  accessible?: boolean
}

const Page = ({
  title,
  content,
  BeforeContent,
  AfterContent,
  Footer,
  language,
  lastUpdate,
  padding = true,
  accessible,
}: PageProps): ReactElement => {
  const [loading, setLoading] = useState(true)
  const navigateToLink = useNavigateToLink()
  const { visible: ttsPlayerVisible } = useTtsPlayer()

  const onLoad = useCallback(() => setLoading(false), [setLoading])

  return (
    <Container $padding={padding} accessible={accessible}>
      {!loading && title ? <Caption title={title} language={language} /> : null}
      {!loading && BeforeContent}
      <RemoteContent
        content={content}
        onLinkPress={navigateToLink}
        onLoad={onLoad}
        loading={loading}
        language={language}
      />
      {!loading && AfterContent}
      {!loading && !!content && lastUpdate && <TimeStamp lastUpdate={lastUpdate} />}
      {!loading && Footer}
      <SpaceForTts $ttsPlayerVisible={ttsPlayerVisible} />
    </Container>
  )
}

export default Page
