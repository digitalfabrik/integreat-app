import { mapValues } from 'lodash'
import { Moment } from 'moment'
import * as React from 'react'
import { ReactElement, useCallback, useContext, useState } from 'react'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import dimensions from '../constants/dimensions'
import DateFormatterContext from '../contexts/DateFormatterContext'
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
type PropsType = {
  title: string
  content: string
  theme: ThemeType
  navigateToLink: (url: string, language: string, shareUrl: string) => void
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
  theme,
  language,
  resourceCacheUrl,
  lastUpdate,
  navigateToFeedback,
  navigateToLink,
  files
}: PropsType): ReactElement => {
  const [loading, setLoading] = useState<boolean>(true)
  const formatter = useContext(DateFormatterContext)
  const cacheDict = cacheDictionary(files, resourceCacheUrl)
  const onLinkPress = useCallback(
    (url: string) => {
      const shareUrl = Object.keys(cacheDict).find(remoteUrl => cacheDict[remoteUrl] === url)
      navigateToLink(url, language, shareUrl || url)
    },
    [navigateToLink, cacheDict, language]
  )
  const onLoad = useCallback(() => setLoading(false), [setLoading])
  return (
    <SpaceBetween>
      <Container>
        <Caption title={title} theme={theme} />
        {children}
        <RemoteContent
          theme={theme}
          content={content}
          cacheDirectory={cacheDict}
          onLinkPress={onLinkPress}
          onLoad={onLoad}
          language={language}
          resourceCacheUrl={resourceCacheUrl}
        />
        {!loading && <TimeStamp formatter={formatter} lastUpdate={lastUpdate} />}
      </Container>
      {navigateToFeedback && !loading && <SiteHelpfulBox navigateToFeedback={navigateToFeedback} theme={theme} />}
    </SpaceBetween>
  )
}

export default Page
