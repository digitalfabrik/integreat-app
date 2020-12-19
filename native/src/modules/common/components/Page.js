// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import type { ThemeType } from '../../theme/constants'
import Caption from './Caption'
import TimeStamp from './TimeStamp'
import type Moment from 'moment'
import type { PageResourceCacheEntryStateType, PageResourceCacheStateType } from '../../app/StateType'
import type { NavigateToInternalLinkParamsType } from '../../app/createNavigateToInternalLink'
import MomentContext from '../../i18n/context/MomentContext'
import RemoteContent from './RemoteContent'
import SiteHelpfulBox from './SiteHelpfulBox'
import SpaceBetween from './SpaceBetween'
import navigateToLink from '../../app/navigateToLink'
import { RESOURCE_CACHE_DIR_PATH } from '../../endpoint/DatabaseConnector'
import { mapValues } from 'lodash'
import type { NavigationPropType, RoutesType } from '../../app/components/NavigationTypes'

const HORIZONTAL_MARGIN = 8

const Container = styled.View`
  margin: 0 ${HORIZONTAL_MARGIN}px 8px;
`

export type ParsedCacheDictionaryType = {| [remoteUrl: string]: string |}

type StateType = {|
  loading: boolean
|}

type PropsType<T: RoutesType> = {|
  title: string,
  content: string,
  theme: ThemeType,
  navigation: NavigationPropType<T>,
  navigateToInternalLink?: NavigateToInternalLinkParamsType => void,
  navigateToFeedback?: (positive: boolean) => void,
  files: PageResourceCacheStateType,
  children?: React.Node,
  language: string,
  resourceCacheUrl: string,
  lastUpdate: Moment,
  hijackRegExp?: RegExp
|}

class Page<T: RoutesType> extends React.Component<PropsType<T>, StateType> {
  state = { loading: true }

  onLinkPress = (url: string) => {
    const { navigation, language, navigateToInternalLink } = this.props
    const cacheDict = this.cacheDictionary()
    const shareUrl = Object.keys(cacheDict).find(remoteUrl => cacheDict[remoteUrl] === url)
    navigateToLink(url, navigation, language, navigateToInternalLink, shareUrl || url)
  }

  onLoad = () => this.setState({ loading: false })

  cacheDictionary = (): ParsedCacheDictionaryType => {
    const { files, resourceCacheUrl } = this.props
    return mapValues(files, (file: PageResourceCacheEntryStateType) => {
      return file.filePath.startsWith(RESOURCE_CACHE_DIR_PATH)
        ? file.filePath.replace(RESOURCE_CACHE_DIR_PATH, resourceCacheUrl)
        : file.filePath
    })
  }

  render () {
    const { title, children, content, theme, language, resourceCacheUrl, lastUpdate, navigateToFeedback } = this.props
    return <SpaceBetween>
      <Container>
        <Caption title={title} theme={theme} />
        {children}
        <RemoteContent theme={theme} content={content} cacheDirectory={this.cacheDictionary()}
                       onLinkPress={this.onLinkPress} onLoad={this.onLoad} language={language}
                       resourceCacheUrl={resourceCacheUrl} />
        {!this.state.loading && <MomentContext.Consumer>
          {formatter => <TimeStamp formatter={formatter} lastUpdate={lastUpdate} language={language} theme={theme} />}
        </MomentContext.Consumer>}
      </Container>
      {navigateToFeedback && !this.state.loading && <SiteHelpfulBox navigateToFeedback={navigateToFeedback}
                                                                    theme={theme} />}
    </SpaceBetween>
  }
}

export default Page
