import { mapValues } from 'lodash'
import { Moment } from 'moment'
import * as React from 'react'
import { ReactElement, useCallback, useContext, useState } from 'react'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
import DateFormatterContext from '../contexts/DateFormatterContext'
import useNavigateToLink from '../hooks/useNavigateToLink'
import { PageResourceCacheEntryStateType, PageResourceCacheStateType } from '../redux/StateType'
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
type PagePropsType = {
  title: string
  content: string
  navigateToFeedback?: (positive: boolean) => void
  files: PageResourceCacheStateType
  children?: React.ReactNode
  language: string
  resourceCacheUrl: string
  lastUpdate: Moment
}

const cacheDictionary = (files: PageResourceCacheStateType, resourceCacheUrl: string): ParsedCacheDictionaryType =>
  mapValues(files, (file: PageResourceCacheEntryStateType) =>
    file.filePath.startsWith(RESOURCE_CACHE_DIR_PATH)
      ? file.filePath.replace(RESOURCE_CACHE_DIR_PATH, resourceCacheUrl)
      : file.filePath
  )

const Page = ({
  title,
  children,
  content,
  language,
  resourceCacheUrl,
  lastUpdate,
  navigateToFeedback,
  files,
}: PagePropsType): ReactElement => {
  const [loading, setLoading] = useState<boolean>(true)
  const navigateToLink = useNavigateToLink()
  const formatter = useContext(DateFormatterContext)
  const cacheDict = cacheDictionary(files, resourceCacheUrl)
  const onLinkPress = useCallback(
    (url: string) => {
      const shareUrl = Object.keys(cacheDict).find(remoteUrl => cacheDict[remoteUrl] === url)
      navigateToLink(url, language, shareUrl || url)
    },
    [cacheDict, language, navigateToLink]
  )
  const onLoad = useCallback(() => setLoading(false), [setLoading])
  return (
    <SpaceBetween>
      <Container>
        <Caption title={title} />
        {children}
        <RemoteContent
          content={content}
          cacheDirectory={cacheDict}
          onLinkPress={onLinkPress}
          onLoad={onLoad}
          language={language}
          resourceCacheUrl={resourceCacheUrl}
        />
        {!loading && <TimeStamp formatter={formatter} lastUpdate={lastUpdate} />}
      </Container>
      {navigateToFeedback && !loading && <SiteHelpfulBox navigateToFeedback={navigateToFeedback} />}
    </SpaceBetween>
  )
}

export default Page
