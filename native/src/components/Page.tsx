import { mapValues } from 'lodash'
import { Moment } from 'moment'
import * as React from 'react'
import { ReactElement, useCallback, useContext, useState } from 'react'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import DateFormatterContext from '../contexts/DateFormatterContext'
import useNavigateToLink from '../hooks/useNavigateToLink'
import useSnackbar from '../hooks/useSnackbar'
import { PageResourceCacheEntryStateType, PageResourceCacheStateType } from '../redux/StateType'
import { RESOURCE_CACHE_DIR_PATH } from '../utils/DatabaseConnector'
import Caption from './Caption'
import RemoteContent from './RemoteContent'
import SiteHelpfulBox from './SiteHelpfulBox'
import SpaceBetween from './SpaceBetween'
import TimeStamp from './TimeStamp'

const HORIZONTAL_MARGIN = 8
const Container = styled.View`
  margin: 0 ${HORIZONTAL_MARGIN}px 8px;
`
export type ParsedCacheDictionaryType = Record<string, string>
type PropsType = {
  title: string
  content: string
  theme: ThemeType
  navigateToFeedback?: (positive: boolean) => void
  files: PageResourceCacheStateType
  children?: React.ReactNode
  language: string
  resourceCacheUrl: string
  lastUpdate: Moment
}

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
  files
}: PropsType): ReactElement => {
  const [loading, setLoading] = useState<boolean>(true)
  const navigateToLink = useNavigateToLink()
  const showSnackbar = useSnackbar()
  const formatter = useContext(DateFormatterContext)
  const cacheDict = cacheDictionary(files, resourceCacheUrl)
  const onLinkPress = useCallback(
    (url: string) => {
      const shareUrl = Object.keys(cacheDict).find(remoteUrl => cacheDict[remoteUrl] === url)
      navigateToLink(url, language, shareUrl || url).catch(showSnackbar)
    },
    [cacheDict, language, navigateToLink, showSnackbar]
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
