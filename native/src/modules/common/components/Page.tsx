// @flow

import * as React from 'react'
import { useState, useContext, useCallback } from 'react'
import styled from 'styled-components/native'
import type { ThemeType } from '../../theme/constants'
import Caption from './Caption'
import TimeStamp from './TimeStamp'
import type Moment from 'moment'
import type { PageResourceCacheEntryStateType, PageResourceCacheStateType } from '../../app/StateType'
import RemoteContent from './RemoteContent'
import SiteHelpfulBox from './SiteHelpfulBox'
import SpaceBetween from './SpaceBetween'
import { RESOURCE_CACHE_DIR_PATH } from '../../endpoint/DatabaseConnector'
import { mapValues } from 'lodash'
import DateFormatterContext from '../../i18n/context/DateFormatterContext'

const HORIZONTAL_MARGIN = 8

const Container = styled.View`
  margin: 0 ${HORIZONTAL_MARGIN}px 8px;
`

export type ParsedCacheDictionaryType = {| [remoteUrl: string]: string |}

type PropsType = {|
  title: string,
  content: string,
  theme: ThemeType,
  navigateToLink: (url: string, language: string, shareUrl: string) => void,
  navigateToFeedback?: (positive: boolean) => void,
  files: PageResourceCacheStateType,
  children?: React.Node,
  language: string,
  resourceCacheUrl: string,
  lastUpdate: Moment
|}

const cacheDictionary = (files: PageResourceCacheStateType, resourceCacheUrl: string): ParsedCacheDictionaryType => {
  return mapValues(files, (file: PageResourceCacheEntryStateType) => {
    return file.filePath.startsWith(RESOURCE_CACHE_DIR_PATH)
      ? file.filePath.replace(RESOURCE_CACHE_DIR_PATH, resourceCacheUrl)
      : file.filePath
  })
}

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
}: PropsType) => {
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
        {!loading && <TimeStamp formatter={formatter} lastUpdate={lastUpdate} language={language} theme={theme} />}
      </Container>
      {navigateToFeedback && !loading && <SiteHelpfulBox navigateToFeedback={navigateToFeedback} theme={theme} />}
    </SpaceBetween>
  )
}

export default Page
