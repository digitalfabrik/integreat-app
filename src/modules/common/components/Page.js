// @flow

import * as React from 'react'
import { Linking } from 'react-native'
import styled from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'
import type { NavigationScreenProp } from 'react-navigation'
import Caption from './Caption'
import TimeStamp from './TimeStamp'
import type Moment from 'moment'
import type { FileResourceCacheStateType } from '../../app/StateType'
import type { NavigateToIntegreatUrlParamsType } from '../../app/createNavigateToIntegreatUrl'
import MomentContext from '../../i18n/context/MomentContext'
import RemoteContent from './RemoteContent'
import SiteHelpfulBox from './SiteHelpfulBox'
import SpaceBetween from './SpaceBetween'
import type { TFunction } from 'react-i18next'

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
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void,
  navigateToFeedback: (positive: boolean) => void,
  files: FileResourceCacheStateType,
  children?: React.Node,
  language: string,
  cityCode: string,
  lastUpdate: Moment,
  t: TFunction
|}

const HIJACK = /https?:\/\/(cms(-test)?\.integreat-app\.de|web\.integreat-app\.de|integreat\.app)(?!\/[^/]*\/(wp-content|wp-admin|wp-json)\/.*).*/

class Page extends React.Component<PropType, StateType> {
  state = { loading: true }

  onLinkPress = (url: string) => {
    const { navigation, language, navigateToIntegreatUrl } = this.props

    if (url.includes('.pdf')) {
      navigation.navigate('PDFViewModal', { url })
    } else if (url.includes('.png') || url.includes('.jpg')) {
      navigation.navigate('ImageViewModal', { url })
    } else if (HIJACK.test(url)) {
      navigateToIntegreatUrl({ url, language })
    } else {
      Linking.openURL(url).catch(err => console.error('An error occurred', err))
    }
  }

  onLoad = () => this.setState({ loading: false })

  render () {
    const { title, children, content, files, theme, language, cityCode, lastUpdate, navigateToFeedback, t } = this.props
    return <SpaceBetween>
      <Container>
        <Caption title={title} theme={theme} />
        {children}
        <RemoteContent theme={theme} cityCode={cityCode} content={content} files={files} onLinkPress={this.onLinkPress}
                       onLoad={this.onLoad} language={language} />
        {!this.state.loading && <MomentContext.Consumer>
          {formatter => <TimeStamp formatter={formatter} lastUpdate={lastUpdate} language={language} theme={theme} />}
        </MomentContext.Consumer>}
      </Container>
      {!this.state.loading && <SiteHelpfulBox navigateToFeedback={navigateToFeedback} theme={theme} t={t} />}
    </SpaceBetween>
  }
}

export default Page
