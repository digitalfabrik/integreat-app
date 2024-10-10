import { mapValues } from 'lodash'
import { DateTime } from 'luxon'
import React, { ReactElement, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
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
  ${props => props.$padding && `padding: 0 ${dimensions.pageContainerPaddingHorizontal}px 8px;`}
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
  const navigateToLink = useNavigateToLink()

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

  return (
    <Container $padding={padding}>
      {!loading && title ? <Caption title={title} language={language} /> : null}
      {!loading && BeforeContent}
      <RemoteContent
        content={content}
        cacheDictionary={cacheDictionary}
        onLinkPress={onLinkPress}
        onLoad={onLoad}
        language={language}
        resourceCacheUrl={resourceCacheUrl}
      />
      {!loading && AfterContent}
      {!loading && !!content && lastUpdate && <TimeStamp lastUpdate={lastUpdate} />}
      {!loading && Footer}
    </Container>
  )
}

export default Page
