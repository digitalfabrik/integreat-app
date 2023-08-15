import { mapValues } from 'lodash'
import { DateTime } from 'luxon'
import React, { ReactElement, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import DateFormatterContext from '../contexts/DateFormatterContext'
import useCityAppContext from '../hooks/useCityAppContext'
import useNavigateToLink from '../hooks/useNavigateToLink'
import useResourceCache from '../hooks/useResourceCache'
import { LanguageResourceCacheStateType, PageResourceCacheEntryStateType } from '../utils/DataContainer'
import { RESOURCE_CACHE_DIR_PATH } from '../utils/DatabaseConnector'
import Caption from './Caption'
import RemoteContent from './RemoteContent'
import { StaticServerContext } from './StaticServerProvider'
import TimeStamp from './TimeStamp'

const Container = styled.View<{ $padding: boolean }>`
  ${props => props.$padding && 'padding: 0 16px 8px;'}
`
export type ParsedCacheDictionaryType = Record<string, string>

const createCacheDictionary = (
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string,
  pagePath?: string,
): ParsedCacheDictionaryType =>
  pagePath
    ? mapValues(resourceCache[pagePath] || {}, (file: PageResourceCacheEntryStateType) =>
        file.filePath.startsWith(RESOURCE_CACHE_DIR_PATH)
          ? file.filePath.replace(RESOURCE_CACHE_DIR_PATH, resourceCacheUrl)
          : file.filePath,
      )
    : {}

type PageProps = {
  title?: string
  content: string
  BeforeContent?: ReactNode
  AfterContent?: ReactNode
  Footer?: ReactNode
  language: string
  lastUpdate?: DateTime
  path?: string
  padding?: boolean
}

const Page = ({
  title,
  content,
  BeforeContent,
  AfterContent,
  Footer,
  language,
  lastUpdate,
  path,
  padding = true,
}: PageProps): ReactElement => {
  const { cityCode, languageCode } = useCityAppContext()
  const resourceCache = useResourceCache({ cityCode, languageCode })
  const resourceCacheUrl = useContext(StaticServerContext)
  const [loading, setLoading] = useState(true)
  const [contentWidth, setContentWidth] = useState(0)
  const navigateToLink = useNavigateToLink()
  const formatter = useContext(DateFormatterContext)

  const cacheDictionary = useMemo(
    () => createCacheDictionary(resourceCache, resourceCacheUrl, path),
    [resourceCache, resourceCacheUrl, path],
  )
  const onLinkPress = useCallback(
    (url: string) => {
      const shareUrl = Object.keys(cacheDictionary).find(remoteUrl => cacheDictionary[remoteUrl] === url)
      navigateToLink(url, shareUrl || url)
    },
    [cacheDictionary, navigateToLink],
  )
  const onLoad = useCallback(() => setLoading(false), [setLoading])
  const measureContentWidth = (event: LayoutChangeEvent) => {
    setContentWidth(event.nativeEvent.layout.width)
  }

  return (
    <Container onLayout={measureContentWidth} $padding={padding}>
      {!loading && title ? <Caption title={title} /> : null}
      {!loading && BeforeContent}
      <RemoteContent
        content={content}
        cacheDictionary={cacheDictionary}
        onLinkPress={onLinkPress}
        onLoad={onLoad}
        language={language}
        resourceCacheUrl={resourceCacheUrl}
        webViewWidth={contentWidth}
      />
      {!loading && AfterContent}
      {!loading && !!content && lastUpdate && <TimeStamp formatter={formatter} lastUpdate={lastUpdate} />}
      {!loading && Footer}
    </Container>
  )
}

export default Page
