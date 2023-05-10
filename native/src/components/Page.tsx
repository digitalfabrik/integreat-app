import { mapValues } from 'lodash'
import { Moment } from 'moment'
import React, { ReactElement, ReactNode, useCallback, useContext, useState } from 'react'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
import DateFormatterContext from '../contexts/DateFormatterContext'
import useNavigateToLink from '../hooks/useNavigateToLink'
import { PageResourceCacheEntryStateType, PageResourceCacheStateType } from '../utils/DataContainer'
import { RESOURCE_CACHE_DIR_PATH } from '../utils/DatabaseConnector'
import Caption from './Caption'
import RemoteContent from './RemoteContent'
import SiteHelpfulBox from './SiteHelpfulBox'
import SpaceBetween from './SpaceBetween'
import TimeStamp from './TimeStamp'

const Container = styled.View`
  margin: 0 ${dimensions.page.horizontalMargin}px 8px;
`
export type ParsedCacheDictionaryType = Record<string, string>

const cacheDictionary = (files: PageResourceCacheStateType, resourceCacheUrl: string): ParsedCacheDictionaryType =>
  mapValues(files, (file: PageResourceCacheEntryStateType) =>
    file.filePath.startsWith(RESOURCE_CACHE_DIR_PATH)
      ? file.filePath.replace(RESOURCE_CACHE_DIR_PATH, resourceCacheUrl)
      : file.filePath
  )

type PageProps = {
  title?: string
  content: string
  BeforeContent?: ReactNode
  AfterContent?: ReactNode
  language: string
  lastUpdate?: Moment
  navigateToFeedback?: (positive: boolean) => void
  files: PageResourceCacheStateType
  resourceCacheUrl: string
}

const Page = ({
  title,
  content,
  BeforeContent,
  AfterContent,
  language,
  lastUpdate,
  navigateToFeedback,
  resourceCacheUrl,
  files,
}: PageProps): ReactElement => {
  const [loading, setLoading] = useState<boolean>(true)
  const navigateToLink = useNavigateToLink()
  const formatter = useContext(DateFormatterContext)

  const cacheDict = cacheDictionary(files, resourceCacheUrl)
  const onLinkPress = useCallback(
    (url: string) => {
      const shareUrl = Object.keys(cacheDict).find(remoteUrl => cacheDict[remoteUrl] === url)
      navigateToLink(url, shareUrl || url)
    },
    [cacheDict, navigateToLink]
  )
  const onLoad = useCallback(() => setLoading(false), [setLoading])

  return (
    <SpaceBetween>
      <Container>
        {title ? <Caption title={title} /> : null}
        {BeforeContent}
        {content ? (
          <RemoteContent
            content={content}
            cacheDirectory={cacheDict}
            onLinkPress={onLinkPress}
            onLoad={onLoad}
            language={language}
            resourceCacheUrl={resourceCacheUrl}
          />
        ) : null}
        {!loading && lastUpdate && <TimeStamp formatter={formatter} lastUpdate={lastUpdate} />}
      </Container>
      {!loading && AfterContent}
      {!loading && navigateToFeedback && <SiteHelpfulBox navigateToFeedback={navigateToFeedback} />}
    </SpaceBetween>
  )
}

export default Page
