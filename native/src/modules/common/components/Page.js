// @flow

import * as React from 'react'
import { Linking } from 'react-native'
import styled from 'styled-components/native'
import type { ThemeType } from '../../theme/constants'
import type { NavigationScreenProp } from 'react-navigation'
import Caption from './Caption'
import TimeStamp from './TimeStamp'
import type Moment from 'moment'
import type { PageResourceCacheStateType } from '../../app/StateType'
import type { NavigateToInternalLinkParamsType } from '../../app/createNavigateToInternalLink'
import MomentContext from '../../i18n/context/MomentContext'
import RemoteContent from './RemoteContent'
import SiteHelpfulBox from './SiteHelpfulBox'
import SpaceBetween from './SpaceBetween'
import buildConfig from '../../app/constants/buildConfig'

const HORIZONTAL_MARGIN = 8

const Container = styled.View`
  margin: 0 ${HORIZONTAL_MARGIN}px 8px;
`

type StateType = {|
  loading: boolean
|}

type PropType = {|
  title: string,
  content: string,
  theme: ThemeType,
  navigation: NavigationScreenProp<*>,
  navigateToInternalLink?: NavigateToInternalLinkParamsType => void,
  navigateToFeedback?: (positive: boolean) => void,
  files: PageResourceCacheStateType,
  children?: React.Node,
  language: string,
  resourceCacheUrl: string,
  lastUpdate: Moment,
  hijackRegExp?: RegExp
|}

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

class Page extends React.Component<PropType, StateType> {
  state = { loading: true }

  onLinkPress = (url: string) => {
    const { navigation, language, navigateToInternalLink } = this.props

    if (url.includes('.pdf')) {
      navigation.navigate('PDFViewModal', { url })
    } else if (url.includes('.png') || url.includes('.jpg')) {
      navigation.navigate('ImageViewModal', { url })
    } else if (navigateToInternalLink && HIJACK.test(url)) {
      navigateToInternalLink({
        url,
        language
      })
    } else {
      Linking.openURL(url).catch(err => console.error('An error occurred', err))
    }
  }

  onLoad = () => this.setState({ loading: false })

  render () {
    const { title, children, content, files, theme, language, resourceCacheUrl, lastUpdate, navigateToFeedback } = this.props
    return <SpaceBetween>
      <Container>
        <Caption title={title} theme={theme} />
        {children}
        <RemoteContent theme={theme} content={content} files={files} onLinkPress={this.onLinkPress}
                       onLoad={this.onLoad} language={language} resourceCacheUrl={resourceCacheUrl} />
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
